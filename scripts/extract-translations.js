/**
 * Script to extract translations from App.tsx into separate files.
 * Run: node scripts/extract-translations.js
 */
const fs = require('fs');
const path = require('path');

const appTsxPath = path.join(__dirname, '..', 'frontend', 'src', 'App.tsx');
const translationsDir = path.join(__dirname, '..', 'frontend', 'src', 'translations');

const content = fs.readFileSync(appTsxPath, 'utf-8');
const lines = content.split('\n');

// Find the translation block boundaries
const startLine = lines.findIndex(l => l.includes("const translations: Record<Lang, Translation> = {"));
const endLine = lines.findIndex((l, i) => i > startLine && l.trim() === '};' && !l.includes('translation'));

if (startLine === -1 || endLine === -1) {
  console.error('Could not find translation boundaries');
  process.exit(1);
}

const translationBlock = lines.slice(startLine, endLine + 1).join('\n');

// Extract FR section
const frMatch = translationBlock.match(/fr:\s*\{[\s\S]*?\}(?=\s*,\s*\n\s*ar:)/);
// Extract AR section
const arMatch = translationBlock.match(/ar:\s*\{[\s\S]*?\}(?=\s*,\s*\n\s*\};)/);

if (!frMatch || !arMatch) {
  console.error('Could not extract FR/AR sections');
  process.exit(1);
}

const frContent = `import type { Translation } from '../types';\n\nexport const fr: Translation = ${frMatch[0].replace(/^fr:\s*/, '')};\n`;
const arContent = `import type { Translation } from '../types';\n\nexport const ar: Translation = ${arMatch[0].replace(/^ar:\s*/, '')};\n`;

fs.mkdirSync(translationsDir, { recursive: true });
fs.writeFileSync(path.join(translationsDir, 'fr.ts'), frContent, 'utf-8');
fs.writeFileSync(path.join(translationsDir, 'ar.ts'), arContent, 'utf-8');

// Create index
const indexContent = `import type { Lang, Translation } from '../types';\nimport { fr } from './fr';\nimport { ar } from './ar';\n\nexport const translations: Record<Lang, Translation> = { fr, ar };\n`;
fs.writeFileSync(path.join(translationsDir, 'index.ts'), indexContent, 'utf-8');

console.log('✅ Translations extracted to frontend/src/translations/');
console.log(`   fr.ts: ${fs.statSync(path.join(translationsDir, 'fr.ts')).size} bytes`);
console.log(`   ar.ts: ${fs.statSync(path.join(translationsDir, 'ar.ts')).size} bytes`);
console.log(`   index.ts: created`);
