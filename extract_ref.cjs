const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('file:///home/scarecrow/dev/aimhotech/references/mobile/AImhotech%20App.html', { waitUntil: 'networkidle0' });
  
  const text = await page.evaluate(() => document.body.innerText);
  require('fs').writeFileSync('dom_text.txt', text);
  console.log('DOM text extracted to dom_text.txt');
  
  await browser.close();
})();
