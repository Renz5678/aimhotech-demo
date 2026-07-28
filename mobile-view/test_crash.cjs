const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text(), msg.location().url);
    }
  });
  
  page.on('pageerror', error => {
    console.log('PAGE EXCEPTION:', error.message);
  });

  try {
    await page.goto('http://localhost:4173/onboarding', { waitUntil: 'networkidle2', timeout: 5000 });
    console.log('Page loaded!');
  } catch (err) {
    console.log('Navigation error:', err.message);
  }
  
  await browser.close();
})();
