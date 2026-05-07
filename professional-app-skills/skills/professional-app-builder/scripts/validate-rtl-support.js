#!/usr/bin/env node
/**
 * validate-rtl-support.js
 *
 * If the project supports Arabic, verifies that RTL is configured correctly.
 *
 * Checks:
 *   - Arabic locale file exists (app_ar.arb or ar.json)
 *   - Directionality is configured (Flutter)
 *   - document.documentElement.dir is set (React)
 *   - No hardcoded Alignment.centerLeft / padding-left in app code
 *
 * Usage:
 *   node validate-rtl-support.js <project-path>
 */

const fs = require('fs');
const path = require('path');

const SKIP_DIRS = new Set(['node_modules', '.git', 'build', 'dist', '.dart_tool', 'ios', 'android', '.next']);

let arabicSupported = false;
let directionalitySet = false;
let dirAttributeSet = false;
let hardcodedDirectionalIssues = [];

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

function detectArabicSupport(filePath) {
  const basename = path.basename(filePath);
  if (basename === 'app_ar.arb' || basename === 'ar.json' || basename.includes('_ar.')) {
    arabicSupported = true;
  }
}

function scanFile(filePath) {
  const ext = path.extname(filePath);
  let content;
  try { content = fs.readFileSync(filePath, 'utf-8'); }
  catch { return; }

  detectArabicSupport(filePath);

  if (ext === '.dart') {
    if (/Directionality\s*\(\s*textDirection\s*:/.test(content)) directionalitySet = true;
    if (/builder:\s*\(\s*context\s*,\s*child\s*\)\s*=>/.test(content) && /Directionality/.test(content)) {
      directionalitySet = true;
    }

    // Hardcoded LTR-biased alignment
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.trim().startsWith('//')) return;
      if (/Alignment\.centerLeft|Alignment\.centerRight|Alignment\.topLeft|Alignment\.topRight|Alignment\.bottomLeft|Alignment\.bottomRight/.test(line)) {
        hardcodedDirectionalIssues.push({
          file: filePath, line: idx + 1, issue: 'Hardcoded Alignment (use AlignmentDirectional.centerStart/centerEnd)',
          context: line.trim().slice(0, 80),
        });
      }
      if (/EdgeInsets\.only\s*\(\s*left\s*:|EdgeInsets\.only\s*\(\s*right\s*:/.test(line)) {
        hardcodedDirectionalIssues.push({
          file: filePath, line: idx + 1, issue: 'Hardcoded EdgeInsets.only(left/right) (use EdgeInsetsDirectional.only(start/end))',
          context: line.trim().slice(0, 80),
        });
      }
    });
  }

  if (['.jsx', '.tsx', '.js', '.ts'].includes(ext)) {
    if (/document\.documentElement\.dir\s*=/.test(content)) dirAttributeSet = true;
    if (/dir\s*=\s*["'](rtl|ltr)["']/.test(content)) dirAttributeSet = true;

    // Hardcoded directional CSS in JSX style props
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.trim().startsWith('//')) return;
      if (/(paddingLeft|paddingRight|marginLeft|marginRight)\s*:\s*['"\d]/.test(line)) {
        hardcodedDirectionalIssues.push({
          file: filePath, line: idx + 1,
          issue: 'Hardcoded directional padding/margin (use paddingInlineStart/End)',
          context: line.trim().slice(0, 80),
        });
      }
    });
  }
}

function main() {
  const projectPath = process.argv[2];
  if (!projectPath) {
    console.error('Usage: node validate-rtl-support.js <project-path>');
    process.exit(2);
  }

  console.log(`Scanning ${projectPath} for RTL support...\n`);
  walkDir(projectPath, scanFile);

  if (!arabicSupported) {
    console.log('SKIP: No Arabic locale detected. RTL validation not required.');
    process.exit(0);
  }

  console.log('Arabic support detected. Running RTL checks...\n');

  let failed = false;

  // Check 1: Directionality / dir attribute
  const hasFlutterCode = fs.existsSync(path.join(projectPath, 'pubspec.yaml'));
  const hasReactCode = fs.existsSync(path.join(projectPath, 'package.json'));

  if (hasFlutterCode && !directionalitySet) {
    console.error('FAIL: Flutter project supports Arabic but no Directionality wrapper found.');
    console.error('      Wrap your MaterialApp builder in a Directionality widget.');
    failed = true;
  }
  if (hasReactCode && !dirAttributeSet) {
    console.error('FAIL: React project supports Arabic but no document.documentElement.dir setting found.');
    console.error('      Set document.documentElement.dir based on i18n.language.');
    failed = true;
  }

  // Check 2: Hardcoded directional values
  if (hardcodedDirectionalIssues.length > 0) {
    console.error(`FAIL: Found ${hardcodedDirectionalIssues.length} hardcoded directional value(s):\n`);
    for (const v of hardcodedDirectionalIssues.slice(0, 20)) {
      console.error(`  ${v.file}:${v.line}`);
      console.error(`    ${v.issue}`);
      console.error(`    > ${v.context}`);
    }
    if (hardcodedDirectionalIssues.length > 20) {
      console.error(`  ... and ${hardcodedDirectionalIssues.length - 20} more.`);
    }
    failed = true;
  }

  if (failed) {
    console.error('\nFix RTL violations to ensure Arabic users see a properly mirrored layout.');
    process.exit(1);
  }

  console.log('PASS: RTL support is properly configured.');
  process.exit(0);
}

main();
