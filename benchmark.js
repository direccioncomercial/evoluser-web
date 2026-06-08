const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`file://${path.resolve('index.html')}`);
  await page.waitForTimeout(1000);

  const metrics = await page.evaluate(async () => {
    // We create elements one by one, waiting for the event loop,
    // so the MutationObserver has to run each time.
    // Each run, querySelectorAll has to search the entire document,
    // which gets larger and larger.
    const start = performance.now();
    for (let i = 0; i < 500; i++) {
      const btn = document.createElement('button');
      btn.textContent = 'Test ' + i;
      document.body.appendChild(btn);

      // Await a task to let MutationObserver fire and process
      await new Promise(r => setTimeout(r, 0));
    }
    const end = performance.now();

    return {
      duration: end - start
    };
  });

  console.log(`Baseline benchmark (500 mutations with waits): ${metrics.duration.toFixed(2)}ms`);

  await browser.close();
})();
