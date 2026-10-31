// Headless-browser smoke test for the Buy Sell Market ("Tap to Trade") demo.
// Usage: node tools/smoke.mjs [url]
//
// Verifies the page loads with no console errors, the start overlay is visible,
// starting the round hides it, the timer counts down, the chart canvas renders,
// and BUY/SELL actually move the portfolio value.

import { chromium } from 'playwright';

const url = process.argv[2] || 'https://mattbullis1.github.io/Buy-Sell-Market/';

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 860 } });

const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(`console: ${m.text()}`);
});

console.log(`Loading ${url} ...`);
const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
if (!res || !res.ok()) fail(`HTTP status ${res ? res.status() : 'no response'}`);

// Overlay (start modal) should be visible on load.
const overlayDisplay = await page.$eval('#overlay', (el) => getComputedStyle(el).display);
if (overlayDisplay === 'none') fail('#overlay is hidden on load');
console.log(`  overlay display on load: ${overlayDisplay}`);

// Start the round.
await page.click('#startBtn');
await page.waitForTimeout(500);

const overlayAfter = await page.$eval('#overlay', (el) => getComputedStyle(el).display);
if (overlayAfter !== 'none') fail('#overlay still visible after Start Round');
console.log(`  overlay after start: ${overlayAfter}`);

// Canvas should be sized.
const canvasBox = await page.$eval('#chart', (c) => ({
  w: c.width,
  h: c.height,
  cw: getComputedStyle(c).width,
  ch: getComputedStyle(c).height,
}));
if (!canvasBox.w || !canvasBox.h) fail('chart canvas has zero size');
console.log(`  chart canvas: ${canvasBox.w}x${canvasBox.h} (css ${canvasBox.cw} x ${canvasBox.ch})`);

// Timer counts down from 60. Sample over several seconds.
const timeSamples = [];
for (let i = 0; i < 4; i++) {
  await page.waitForTimeout(1000);
  timeSamples.push(await page.$eval('#timer', (el) => el.textContent));
}
console.log(`  timer samples: ${timeSamples.join(', ')}`);
if (new Set(timeSamples).size === 1) fail('timer did not start counting down');

// BUY should convert cash into coins.
const startValue = await page.$eval('#valueLabel', (el) => el.textContent);
await page.click('#buyBtn');
await page.waitForTimeout(400);
const afterBuyCoin = await page.$eval('#coinLabel', (el) => el.textContent);
const afterBuyCash = await page.$eval('#cashLabel', (el) => el.textContent);
console.log(`  after BUY: coin=${afterBuyCoin} cash=${afterBuyCash}`);
if (Number(afterBuyCoin) <= 0) fail('BUY did not acquire any coin');
if (Number(afterBuyCash.replace('$', '')) !== 0) fail('BUY did not spend the cash');

// Wait for the market to move, then SELL should convert coins back to cash.
await page.waitForTimeout(3000);
await page.click('#sellBtn');
await page.waitForTimeout(400);
const afterSellCoin = await page.$eval('#coinLabel', (el) => el.textContent);
const afterSellCash = await page.$eval('#cashLabel', (el) => el.textContent);
const afterSellValue = await page.$eval('#valueLabel', (el) => el.textContent);
console.log(`  after SELL: coin=${afterSellCoin} cash=${afterSellCash} value=${afterSellValue}`);
if (Number(afterSellCoin) !== 0) fail('SELL did not clear the coin position');
if (Number(afterSellCash.replace('$', '')) <= 0) fail('SELL did not return any cash');

console.log(`  portfolio value: started ${startValue}, now ${afterSellValue}`);

if (errors.length) fail(`page errors:\n${errors.join('\n')}`);

await browser.close();
console.log('PASS: smoke test completed successfully.');
