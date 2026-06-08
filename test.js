const { chromium } = require('playwright');
const path = require('path');
const assert = require('assert');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`file://${path.resolve('index.html')}`);
  await page.waitForTimeout(1000); // let animations load

  // Test hover on an existing button
  const button = await page.locator('button').first();
  await button.hover();
  await page.waitForTimeout(100);

  const isHovering = await page.evaluate(() => {
    return document.getElementById('custom-cursor').classList.contains('hovering');
  });

  assert.strictEqual(isHovering, true, 'Cursor should have "hovering" class on hover');

  // Test unhover
  await page.mouse.move(0, 0); // move away
  await page.waitForTimeout(100);

  const isHoveringAfter = await page.evaluate(() => {
    return document.getElementById('custom-cursor').classList.contains('hovering');
  });

  assert.strictEqual(isHoveringAfter, false, 'Cursor should not have "hovering" class after mouse out');

  // Test dynamically added button
  await page.evaluate(() => {
    const btn = document.createElement('button');
    btn.id = 'dynamic-test-btn';
    btn.textContent = 'Dynamic';
    document.body.appendChild(btn);
  });

  await page.locator('#dynamic-test-btn').hover();
  await page.waitForTimeout(100);

  const isHoveringDynamic = await page.evaluate(() => {
    return document.getElementById('custom-cursor').classList.contains('hovering');
  });

  assert.strictEqual(isHoveringDynamic, true, 'Cursor should have "hovering" class on dynamically added button hover');

  console.log('All tests passed!');

  await browser.close();
})();
