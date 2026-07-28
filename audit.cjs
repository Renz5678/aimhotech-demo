const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto('file:///home/scarecrow/dev/aimhotech/references/mobile/AImhotech%20App.html', { waitUntil: 'networkidle0' });
  
  fs.mkdirSync('audit', { recursive: true });

  const clickText = async (textToMatch) => {
    await page.evaluate((text) => {
      const els = Array.from(document.querySelectorAll('button, a, div, span'));
      const target = els.find(el => el.textContent.trim() === text);
      if(target) target.click();
    }, textToMatch);
    await new Promise(r => setTimeout(r, 1000));
  };

  const dumpText = async (name) => {
    const text = await page.evaluate(() => document.body.innerText);
    const lines = text.split('\n');
    const startIdx = lines.findIndex(l => l.includes('9:30')) + 1;
    const phoneContent = startIdx > 0 ? lines.slice(startIdx).join('\n') : text;
    fs.writeFileSync(`audit/${name}.txt`, phoneContent);
    console.log(`Saved ${name}`);
  };

  // 1. Worker Screening Flow
  await clickText('Health Worker');
  await clickText('New screening wizard');
  await dumpText('worker_screening_step_1');
  
  await clickText('Confirm & continue');
  await dumpText('worker_screening_step_2');
  
  await clickText('Done');
  await dumpText('worker_screening_step_3');
  
  await clickText('Submit Screening');
  await dumpText('worker_screening_step_4');

  // 2. Patient Settings & Consent
  await clickText('Patient');
  await clickText('Settings & consent');
  await dumpText('patient_settings');

  // 3. Sync Status
  await clickText('Health Worker');
  await clickText('Sync status');
  await dumpText('worker_sync_status');

  await browser.close();
})();
