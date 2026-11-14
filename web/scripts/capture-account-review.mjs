/** SCRUM-49: capture real account routes without submitting to a service. */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { chromium } from '@playwright/test';

const { values } = parseArgs({ options: {
  output: { type: 'string', default: 'report_build/scrum49-capture' },
  channel: { type: 'string' },
  url: { type: 'string', default: 'http://127.0.0.1:5173' },
} });
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const output = path.resolve(root, values.output);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: values.channel });
try {
  const page = await browser.newPage();
  await page.route('**/api/**', route => route.abort());
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 });
    for (const route of ['sign-in', 'register', 'account-created', 'profile']) {
      await page.goto(`${values.url}/#/${route}`);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: path.join(output, `${route}-${width}.png`), fullPage: true });
    }
  }
  console.log('Captured four account routes at desktop and phone widths; API requests blocked.');
} finally { await browser.close(); }
