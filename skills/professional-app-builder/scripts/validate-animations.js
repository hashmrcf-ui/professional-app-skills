#!/usr/bin/env node
/**
 * validate-animations.js
 *
 * Checks that the project follows the animation rules:
 *   - AnimatedCounter (or equivalent) is used for numeric displays
 *   - Press feedback exists on buttons
 *   - Loading states use skeletons, not lone spinners
 *
 * Usage:
 *   node validate-animations.js <project-path>
 */

const fs = require('fs');
const path = require('path');

const SKIP_DIRS = new Set(['node_modules', '.git', 'build', 'dist', '.dart_tool', 'ios', 'android', '.next']);

let warnings = [];
let staticNumberCandidates = [];
let hasAnimatedCounter = false;
let hasSkeleton = false;
let hasPressFeedback = false;
let buttonCount = 0;

function walkDir(dir, callback) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (SKIP_DIRS.has(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) walkDir(fullPath, callback);
      else if (entry.isFile()) callback(fullPath);
    }
  } catch { /* ignore */ }
}

function scanFile(filePath) {
  const ext = path.extname(filePath);
  if (!['.dart', '.jsx', '.tsx', '.js', '.ts'].includes(ext)) return;

  let content;
  try { content = fs.readFileSync(filePath, 'utf-8'); }
  catch { return; }

  // Detect AnimatedCounter or counting hooks
  if (/AnimatedCounter|CountUp|useCountUp|animatedCount|TweenAnimationBuilder/.test(content)) {
    hasAnimatedCounter = true;
  }

  // Detect skeleton loaders
  if (/Skeleton|Shimmer|shimmer\.fromColors/i.test(content)) {
    hasSkeleton = true;
  }

  // Detect press feedback (scale animations on buttons)
  if (/AnimatedScale|scale:\s*[\d.]+|transform:\s*\[\s*\{\s*scale:|GestureDetector.*onTapDown/.test(content)) {
    hasPressFeedback = true;
  }

  // Count buttons (rough)
  const buttonMatches = content.match(/<Button[\s>]|ElevatedButton\(|TextButton\(|<Pressable[\s>]|<TouchableOpacity[\s>]/g);
  if (buttonMatches) buttonCount += buttonMatches.length;

  // Detect lone spinner usage (potential warning)
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (/CircularProgressIndicator\s*\(\s*\)|<ActivityIndicator\s*\/>|<Spinner\s*\/>/.test(line)) {
      // Check if this file also has skeleton — if not, warn
      if (!hasSkeleton) {
        warnings.push({
          file: filePath, line: idx + 1,
          issue: 'Lone spinner detected (consider replacing with skeleton)',
          context: line.trim().slice(0, 80),
        });
      }
    }
  });

  // Heuristic: detect static numbers that might benefit from animation
  // Look for Text widgets / JSX text wrapping plain numbers
  lines.forEach((line, idx) => {
    if (line.trim().startsWith('//')) return;
    // Flutter: Text('123') or Text("\$123")
    const flutterStaticNum = line.match(/Text\s*\(\s*['"]\s*\$?(\d{2,})/);
    if (flutterStaticNum) {
      staticNumberCandidates.push({
        file: filePath, line: idx + 1,
        value: flutterStaticNum[1],
        context: line.trim().slice(0, 80),
      });
    }
    // React: <Text>{123}</Text> or >{123}<
    const reactStaticNum = line.match(/>\{?\s*(\d{2,})\s*\}?</);
    if (reactStaticNum && !line.includes('AnimatedCounter') && !line.includes('CountUp')) {
      staticNumberCandidates.push({
        file: filePath, line: idx + 1,
        value: reactStaticNum[1],
        context: line.trim().slice(0, 80),
      });
    }
  });
}

function main() {
  const projectPath = process.argv[2];
  if (!projectPath) {
    console.error('Usage: node validate-animations.js <project-path>');
    process.exit(2);
  }

  console.log(`Scanning ${projectPath} for animation compliance...\n`);
  walkDir(projectPath, scanFile);

  let failed = false;

  // Required checks
  if (!hasAnimatedCounter && staticNumberCandidates.length > 0) {
    console.error(`FAIL: No AnimatedCounter detected, but found ${staticNumberCandidates.length} static number(s) that should animate:\n`);
    for (const v of staticNumberCandidates.slice(0, 10)) {
      console.error(`  ${v.file}:${v.line}  →  number "${v.value}"`);
      console.error(`    > ${v.context}`);
    }
    if (staticNumberCandidates.length > 10) {
      console.error(`  ... and ${staticNumberCandidates.length - 10} more.`);
    }
    failed = true;
  }

  if (buttonCount > 0 && !hasPressFeedback) {
    console.error(`FAIL: Found ${buttonCount} button(s) but no press feedback animations detected.`);
    console.error('      Add scale-on-press feedback (0.95 transform) to buttons.');
    failed = true;
  }

  // Warnings (non-fatal)
  if (warnings.length > 0) {
    console.warn(`WARN: ${warnings.length} animation warning(s):\n`);
    for (const w of warnings.slice(0, 5)) {
      console.warn(`  ${w.file}:${w.line}  →  ${w.issue}`);
    }
  }

  if (failed) {
    console.error('\nFix the above to comply with the animation rules in resources/animation-patterns.md');
    process.exit(1);
  }

  console.log('PASS: Animation rules satisfied.');
  console.log(`  - AnimatedCounter present: ${hasAnimatedCounter}`);
  console.log(`  - Skeleton loaders present: ${hasSkeleton}`);
  console.log(`  - Press feedback present: ${hasPressFeedback}`);
  console.log(`  - Buttons detected: ${buttonCount}`);
  process.exit(0);
}

main();
