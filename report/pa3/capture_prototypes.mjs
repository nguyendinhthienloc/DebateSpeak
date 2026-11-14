/** Render local-only UC screens and verify navigation, trust controls and mobile layout. */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "../../report_build/mermaid/node_modules/playwright/index.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const pa3 = path.join(root, "docs/pa3");
const catalogue = JSON.parse(await fs.readFile(path.join(pa3, "use_cases.json"), "utf8"));
const stateInventory = JSON.parse(await fs.readFile(path.join(pa3, "prototype_states.json"), "utf8"));
const screenshots = path.join(pa3, "ui-prototypes/screenshots");
await fs.mkdir(screenshots, { recursive: true });
const candidates = [
  process.env.BROWSER_EXECUTABLE,
  process.env.ProgramFiles && path.join(process.env.ProgramFiles, "Google/Chrome/Application/chrome.exe"),
  process.env["ProgramFiles(x86)"] && path.join(process.env["ProgramFiles(x86)"], "Microsoft/Edge/Application/msedge.exe"),
].filter(Boolean);
let executablePath;
for (const candidate of candidates) {
  try { await fs.access(candidate); executablePath = candidate; break; } catch { /* Try next installed browser. */ }
}
const browser = await chromium.launch({ executablePath, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1024 }, deviceScaleFactor: 1 });
const errors = [];
page.on("pageerror", error => errors.push(error.message));
await page.route("**/*", route => route.request().url().startsWith("file:") ? route.continue() : route.abort());
const base = pathToFileURL(path.join(pa3, "ui-prototypes/index.html")).href;
const results = [];
function requireCondition(condition, detail) { if (!condition) throw new Error(detail); }
try {
  for (const uc of catalogue.use_cases) {
    await page.goto(`${base}#${uc.id}`);
    await page.waitForFunction(id => window.PA3_READY === id, uc.id);
    requireCondition(await page.locator("h1").textContent() === uc.title, `Wrong title: ${uc.id}`);
    requireCondition(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow: ${uc.id}`);
    await page.locator("main").screenshot({ path: path.join(screenshots, `${uc.screen}.png`) });
    const action = page.locator("#primary-action");
    if (["UC-01-01", "UC-01-02"].includes(uc.id)) {
      await action.click();
      requireCondition((await page.locator("#result").textContent()).includes("highlighted entries"), "Empty password cannot confirm success");
      await page.locator('#content input[type="password"]').fill("Example-only-password");
      if (uc.id === "UC-01-01") await page.locator("#terms").check();
    }
    if (uc.id === "UC-03-01") {
      await page.locator('select[aria-label="Stance mode"]').selectOption("Creator picks");
      requireCondition(await page.locator("#creator-stance-field").isVisible(), "Creator stance must be selectable");
      await page.locator('select[aria-label="Stance mode"]').selectOption("Random");
    }
    if (uc.id === "UC-03-05") {
      requireCondition(await action.isDisabled(), "Build 1 start must stay disabled");
      await page.locator("#ready-scenario").check();
      await action.click();
      requireCondition((await page.locator("#result-title").textContent()).includes("LIVE"), "Authorized future start preview");
      await page.locator("main").screenshot({ path: path.join(screenshots, `${uc.screen}-authorized.png`) });
      await page.locator("#ready-scenario").uncheck();
      requireCondition(await action.isDisabled(), "Return to blocked Build 1 scenario");
    }
    if (uc.id === "UC-01-07") {
      requireCondition(await action.isDisabled(), "Deletion confirmation initially blocked");
      await page.locator('#content input[type="text"]').fill("DELETE");
      await page.locator("#delete-confirm").check();
      requireCondition(await action.isEnabled(), "Explicit deletion confirmation enables preview");
    }
    if (uc.id === "UC-03-04") {
      await action.click();
      requireCondition((await page.locator("#result").textContent()).includes("Start is blocked"), "Decline consent must block start");
      await page.locator("#processing-consent").check();
      await action.click();
      requireCondition((await page.locator("#result").textContent()).includes("no audio starts"), "Own consent cannot start capture");
    }
    if (uc.id === "UC-03-06") {
      requireCondition(await action.isDisabled(), "End preview requires explicit choice");
      await page.locator("#end-confirm").check();
      await page.locator("#content select").selectOption("READY");
      await action.click();
      requireCondition((await page.locator("#result").textContent()).includes("LOBBY"), "Pre-LIVE leaving returns remaining member to lobby");
    }
    if (uc.id === "UC-03-09") {
      await page.locator("#content select").selectOption("Dismiss report");
      await action.click();
      requireCondition((await page.locator("#result-title").textContent()).includes("dismissed"), "Dismissing report must not close the room");
    }
    if (uc.id === "UC-03-11" || uc.id === "UC-09-04") {
      requireCondition(await action.isDisabled(), "Missing own consent must block preview");
      await page.locator(uc.id === "UC-03-11" ? "#solo-consent" : "#grade-sharing").check();
    }
    if (uc.id === "UC-03-12") {
      await page.locator("#audience-scenario").check();
      await action.click();
      requireCondition((await page.locator("#result-title").textContent()).includes("Subscribe only"), "Authorized audience cannot publish");
      await page.locator("main").screenshot({ path: path.join(screenshots, `${uc.screen}-authorized.png`) });
    }
    if (uc.id === "UC-04-04") {
      await action.click();
      requireCondition((await page.locator("#result").textContent()).includes("Camera remains off"), "Camera refusal preserves audio");
    }
    if (uc.id === "UC-09-05") {
      requireCondition(await page.locator('#content input[type="number"]').count() === 12, "Six scores for each of two debaters");
      const first = page.locator('#content input[type="number"]').first();
      await first.fill("101");
      await action.click();
      requireCondition((await page.locator("#result").textContent()).includes("highlighted entries"), "Out-of-range grade cannot submit");
      await first.fill("70");
    }
    if (await action.isEnabled()) await action.click();
    await page.locator("#alternatives-tab").click();
    await page.waitForFunction(() => !document.querySelector("#alternative-view").hidden);
    const expected = stateInventory.use_cases.find(item => item.id === uc.id).alternatives.length;
    requireCondition(await page.locator(".state-screen").count() === expected && expected > 0, `Alternative coverage: ${uc.id}`);
    await page.locator("main").screenshot({ path: path.join(screenshots, `${uc.screen}-alternatives.png`) });
    await page.locator(".recover").first().click();
    await page.waitForFunction(() => !document.querySelector("#basic-view").hidden);
    results.push({ id: uc.id, alternative_screens: expected, basic: "passed", recovery: "passed" });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  for (const id of ["UC-01-01", "UC-03-03", "UC-03-04", "UC-06-01", "UC-09-05", "UC-10-01"]) {
    await page.goto(`${base}#${id}`);
    requireCondition(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Mobile overflow: ${id}`);
    await page.screenshot({ path: path.join(screenshots, `${id.toLowerCase()}-mobile.png`), fullPage: true });
  }
  requireCondition(errors.length === 0, `Browser errors: ${errors.join("; ")}`);
  await fs.writeFile(path.join(root, "report_build/pa3-prototype-validation.json"), JSON.stringify({
    use_cases: results.length,
    alternative_screens: results.reduce((sum, item) => sum + item.alternative_screens, 0),
    mobile_width: 390, browser_errors: errors, results,
  }, null, 2));
  console.log(`Verified ${results.length} use cases; ${results.reduce((sum, item) => sum + item.alternative_screens, 0)} alternative states; mobile layouts; no network calls.`);
} finally { await browser.close(); }
