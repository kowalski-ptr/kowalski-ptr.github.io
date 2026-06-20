#!/usr/bin/env node
// Pomocnik: wypisuje kategorie używane we frontmatterach postów wraz z liczbą
// postów. Oznacza kategorie użyte tylko raz (***) — częsty sygnał literówki
// (np. "Container" vs "Containers"). NIE zmienia żadnej konfiguracji ani schematu.
//
// Uruchom: npm run categories

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const postsDir = path.join(root, 'src/content/posts');

function extractCategory(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const line = m[1].split(/\r?\n/).find((l) => /^category\s*:/.test(l));
  if (!line) return null;
  return line.replace(/^category\s*:/, '').trim().replace(/^["'“”]|["'“”]$/g, '').trim() || null;
}

const files = (await fs.readdir(postsDir)).filter((f) => /\.mdx?$/.test(f));
const counts = new Map();

for (const f of files) {
  const cat = extractCategory(await fs.readFile(path.join(postsDir, f), 'utf8'));
  if (cat) counts.set(cat, (counts.get(cat) ?? 0) + 1);
}

const rows = [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0], 'pl'));
console.log(`\nKategorie w postach (${rows.length}):\n`);
for (const [cat, n] of rows) {
  console.log(`  ${String(n).padStart(2)}  ${cat}`);
}

// wykryj bliźniacze pisownie: ta sama nazwa po normalizacji (lowercase, bez spacji,
// bez końcowego 's') = prawdopodobna literówka / niespójność
const groups = new Map();
for (const [cat] of rows) {
  const key = cat.toLowerCase().replace(/\s+/g, '').replace(/s$/, '');
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(cat);
}
const dups = [...groups.values()].filter((g) => g.length > 1);
if (dups.length) {
  console.log('\n  ⚠ możliwe niespójności (ujednolić?):');
  for (const g of dups) console.log(`     ${g.join('  vs  ')}`);
}
console.log('');
