const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto('file:///home/scarecrow/dev/aimhotech/references/mobile/AImhotech%20App.html', { waitUntil: 'networkidle0' });
  
  const jumpButtons = [
    'Onboarding & consent',
    'Login (ID + OTP)',
    'Home dashboard',
    'My Health · trends',
    'Appointments & referrals',
    'Settings & consent',
    'Station home',
    'New screening wizard',
    'Patient lookup',
    'Sync status',
    'Settings & devices'
  ];

  fs.mkdirSync('ref_dumps', { recursive: true });

  for (const btnName of jumpButtons) {
    await page.evaluate((name) => {
      const btns = Array.from(document.querySelectorAll('button, a, div')).filter(el => el.textContent.trim() === name);
      if (btns.length > 0) btns[0].click();
    }, btnName);
    
    await new Promise(r => setTimeout(r, 1000));
    
    const text = await page.evaluate(() => document.body.innerText);
    // filter out the left panel to just see the phone content
    const lines = text.split('\n');
    const startIdx = lines.findIndex(l => l.includes('9:30')) + 1; // 9:30 is the phone time
    const phoneContent = startIdx > 0 ? lines.slice(startIdx).join('\n') : text;
    
    const safeName = btnName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    fs.writeFileSync(`ref_dumps/${safeName}.txt`, phoneContent);
    console.log(`Saved ${safeName}`);
  }
  
  await browser.close();
})();
