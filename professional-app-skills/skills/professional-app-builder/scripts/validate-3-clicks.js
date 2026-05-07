#!/usr/bin/env node
/**
 * validate-3-clicks.js
 *
 * Analyzes the navigation structure of a Flutter or React project and
 * verifies that no screen requires more than 3 taps from the home screen.
 *
 * Detection strategy:
 *   - Flutter: parses GoRouter / MaterialApp routes, builds a route graph
 *   - React: parses react-router config (react-router-dom v6 syntax)
 *
 * Limitations:
 *   - Detects declared routes; cannot follow runtime-generated navigation
 *   - Counts route nesting depth, treats it as a proxy for tap depth
 *
 * Usage:
 *   node validate-3-clicks.js <project-path>
 */

const fs = require('fs');
const path = require('path');

const MAX_DEPTH = 3;
const SKIP_DIRS = new Set(['node_modules', '.git', 'build', 'dist', '.dart_tool', 'ios', 'android', '.next']);

let violations = [];
let routesFound = 0;

function walkDir(dir, callback) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (SKIP_DIRS.has(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) walkDir(fullPath, callback);
      else if (entry.isFile()) callback(fullPath);
    }
  } catch (err) { /* ignore */ }
}

// ============ Flutter Detection ============

function analyzeDartRoutes(filePath, content) {
  // Look for GoRoute or MaterialPageRoute paths
  const goRouteRegex = /GoRoute\s*\(\s*path:\s*['"`]([^'"`]+)['"`]/g;
  const namedRouteRegex = /['"`](\/[^'"`\s]+)['"`]\s*:/g;

  const paths = [];
  let m;
  while ((m = goRouteRegex.exec(content)) !== null) paths.push(m[1]);
  while ((m = namedRouteRegex.exec(content)) !== null) paths.push(m[1]);

  for (const p of paths) {
    routesFound++;
    const depth = p.split('/').filter(Boolean).length;
    if (depth > MAX_DEPTH) {
      violations.push({ file: filePath, route: p, depth });
    }
  }
}

// ============ React Detection ============

function analyzeReactRoutes(filePath, content) {
  // Match <Route path="..."> declarations
  const routeRegex = /<Route\s+[^>]*path\s*=\s*["']([^"']+)["']/g;
  // Match createBrowserRouter / object-style routes
  const objectPathRegex = /\{\s*path:\s*["']([^"']+)["']/g;

  const paths = [];
  let m;
  while ((m = routeRegex.exec(content)) !== null) paths.push(m[1]);
  while ((m = objectPathRegex.exec(content)) !== null) paths.push(m[1]);

  for (const p of paths) {
    if (p === '/' || p === '*') continue; // skip root and catch-all
    routesFound++;
    const depth = p.split('/').filter(Boolean).length;
    if (depth > MAX_DEPTH) {
      violations.push({ file: filePath, route: p, depth });
    }
  }
}

// ============ Bottom Tab Detection ============

function detectExcessiveTabs(filePath, content) {
  // Flutter: BottomNavigationBarItem count
  const flutterTabMatches = content.match(/BottomNavigationBarItem\s*\(/g);
  if (flutterTabMatches && flutterTabMatches.length > 5) {
    violations.push({
      file: filePath,
      issue: `${flutterTabMatches.length} bottom tabs (max 5)`,
      depth: null,
    });
  }

  // React: count tab items in common patterns
  const reactTabMatches = content.match(/<TabsTrigger/g) || content.match(/<BottomNavigationAction/g);
  if (reactTabMatches && reactTabMatches.length > 5) {
    violations.push({
      file: filePath,
      issue: `${reactTabMatches.length} bottom tabs (max 5)`,
      depth: null,
    });
  }
}

function scanFile(filePath) {
  const ext = path.extname(filePath);
  if (!['.dart', '.jsx', '.tsx', '.js', '.ts'].includes(ext)) return;

  let content;
  try { content = fs.readFileSync(filePath, 'utf-8'); }
  catch { return; }

  if (ext === '.dart') {
    analyzeDartRoutes(filePath, content);
  } else {
    analyzeReactRoutes(filePath, content);
  }
  detectExcessiveTabs(filePath, content);
}

function main() {
  const projectPath = process.argv[2];
  if (!projectPath) {
    console.error('Usage: node validate-3-clicks.js <project-path>');
    process.exit(2);
  }

  console.log(`Scanning ${projectPath} for navigation depth violations...\n`);
  walkDir(projectPath, scanFile);

  if (routesFound === 0) {
    console.log('WARN: No routes detected. Cannot verify 3-tap rule.');
    console.log('      Ensure your routes use standard patterns (GoRoute / <Route> / createBrowserRouter).');
    process.exit(0);
  }

  if (violations.length === 0) {
    console.log(`PASS: All ${routesFound} routes are within ${MAX_DEPTH} taps.`);
    process.exit(0);
  }

  console.error(`FAIL: Found ${violations.length} navigation violation(s):\n`);
  for (const v of violations) {
    if (v.route) {
      console.error(`  ${v.file}`);
      console.error(`    Route "${v.route}" is ${v.depth} levels deep (max ${MAX_DEPTH}).`);
    } else {
      console.error(`  ${v.file}`);
      console.error(`    ${v.issue}`);
    }
  }
  console.error('\nFlatten your navigation. Use bottom tabs + cards on home for shortcuts to deep features.');
  process.exit(1);
}

main();
