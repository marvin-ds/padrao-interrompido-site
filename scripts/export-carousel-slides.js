const { chromium } = require("playwright");

const inputFile = "file:///C:/Users/PICHAU/Downloads/carrossel-padrao-interrompido-consumo-v3.html";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1350 },
    deviceScaleFactor: 1,
  });

  await page.goto(inputFile, { waitUntil: "networkidle" });

  for (let i = 1; i <= 9; i += 1) {
    const slide = await page.$(`#s${i}`);
    if (!slide) {
      throw new Error(`Slide #s${i} not found`);
    }

    await slide.screenshot({
      path: `slide-${String(i).padStart(2, "0")}.png`,
    });
  }

  await browser.close();
})();
