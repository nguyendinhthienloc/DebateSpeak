// Captures every route in src/routes.ts at phone and desktop width.
// Usage: node scripts/screens.mjs <output-dir> [base-url]
// Needs the dev server running (npm run dev). Output is not committed.
import { mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { chromium } from '@playwright/test';

const [outDir, baseUrl = 'http://127.0.0.1:5173'] = process.argv.slice(2);
if (!outDir) {
  console.error('Usage: node scripts/screens.mjs <output-dir> [base-url]');
  process.exit(1);
}

const here = path.dirname(fileURLToPath(import.meta.url));
const source = await readFile(path.join(here, '..', 'src', 'routes.ts'), 'utf8');
const paths = [...source.matchAll(/path: '([^']+)'/g)].map(match => match[1]);
const widths = [390, 1102];

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  for (const route of paths) {
    await page.goto(`${baseUrl}/#${route}`);
    await page.waitForLoadState('networkidle');
    const name = `${route.slice(1).replaceAll('/', '_') || 'root'}-${width}.png`;
    await page.screenshot({ path: path.join(outDir, name), fullPage: true });
  }
  await page.close();
}
await browser.close();
console.log(`${paths.length * widths.length} screenshots in ${outDir}`);
