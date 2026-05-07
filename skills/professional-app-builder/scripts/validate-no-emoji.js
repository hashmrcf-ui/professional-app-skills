#!/usr/bin/env node
/**
 * validate-no-emoji.js
 *
 * Scans a project directory for emoji characters used in UI code.
 * Allowlist: emojis inside string literals that look like translation values
 * for user-content (chat messages, etc.) — but emojis in JSX/Dart UI children
 * are flagged as violations.
 *
 * Usage:
 *   node validate-no-emoji.js <project-path>
 *
 * Exit codes:
 *   0 — no violations
 *   1 — violations found
 *   2 — usage error
 */

const fs = require('fs');
const path = require('path');

// Comprehensive emoji regex covering most Unicode emoji ranges
const EMOJI_REGEX = /(\p{Extended_Pictographic}(\u{FE0F}|\u{200D}\p{Extended_Pictographic})*)/gu;

const SCANNED_EXTENSIONS = ['.dart', '.jsx', '.tsx', '.js', '.ts', '.html', '.vue', '.svelte'];
const SKIP_DIRS = new Set(['node_modules', '.git', 'build', 'dist', '.dart_tool', 'ios', 'android', '.next', 'coverage']);

// Patterns that indicate emoji is in a UI context (forbidden)
const UI_CONTEXT_PATTERNS = [
  /<Text[^>]*>[^<]*$/,        // Inside <Text>
  /Text\s*\(\s*['"`][^'"`]*$/,// Flutter Text(
  /title:\s*['"`][^'"`]*$/,   // title: "..."
  /label:\s*['"`][^'"`]*$/,   // label: "..."
  /children:\s*['"`][^'"`]*$/,// children: "..."
];

let totalViolations = 0;
const violationsByFile = {};

function walkDir(dir, callback) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (SKIP_DIRS.has(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath, callback);
      } else if (entry.isFile() && SCANNED_EXTENSIONS.includes(path.extname(entry.name))) {
        callback(fullPath);
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dir}: ${err.message}`);
  }
}

function isUIContext(line, matchIndex) {
  const before = line.slice(0, matchIndex);
  return UI_CONTEXT_PATTERNS.some(pattern => pattern.test(before));
}

function scanFile(filePath) {
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    return;
  }

  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    // Skip comments
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('#')) return;

    let match;
    EMOJI_REGEX.lastIndex = 0;
    while ((match = EMOJI_REGEX.exec(line)) !== null) {
      // Only flag if it appears in a UI context
      if (isUIContext(line, match.index)) {
        if (!violationsByFile[filePath]) violationsByFile[filePath] = [];
        violationsByFile[filePath].push({
          line: idx + 1,
          column: match.index + 1,
          emoji: match[0],
          context: line.trim().slice(0, 100),
        });
        totalViolations++;
      }
    }
  });
}

function main() {
  const projectPath = process.argv[2];
  if (!projectPath) {
    console.error('Usage: node validate-no-emoji.js <project-path>');
    process.exit(2);
  }
  if (!fs.existsSync(projectPath)) {
    console.error(`Path not found: ${projectPath}`);
    process.exit(2);
  }

  console.log(`Scanning ${projectPath} for emoji violations...\n`);
  walkDir(projectPath, scanFile);

  if (totalViolations === 0) {
    console.log('PASS: No emoji UI violations found.');
    process.exit(0);
  }

  console.error(`FAIL: Found ${totalViolations} emoji violation(s):\n`);
  for (const [file, violations] of Object.entries(violationsByFile)) {
    console.error(`  ${file}`);
    for (const v of violations) {
      console.error(`    Line ${v.line}:${v.column}  ${v.emoji}  →  ${v.context}`);
    }
    console.error('');
  }
  console.error('Replace these emojis with proper SVG icons (lucide-react / Material Icons / flutter_svg).');
  process.exit(1);
}

main();
