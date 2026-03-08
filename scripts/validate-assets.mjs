import fs from 'node:fs';
import path from 'node:path';
import manifest from '../src/stories/terminal-velocity/assets/manifest.json' assert { type: 'json' };

const root = process.cwd();
const errors = [];

function checkEntry(entry) {
  const abs = path.join(root, entry.path);
  if (!fs.existsSync(abs)) {
    errors.push(`Missing asset: ${entry.path}`);
    return;
  }
  const stat = fs.statSync(abs);
  if (stat.size > entry.maxBytes) {
    errors.push(`Asset too large: ${entry.path} (${stat.size} > ${entry.maxBytes})`);
  }
}

for (const entry of manifest) checkEntry(entry);

if (errors.length > 0) {
  console.error('Asset validation failed:');
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}

console.log(`Asset validation passed (${manifest.length} entries).`);
