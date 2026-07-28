const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto('file:///home/scarecrow/dev/aimhotech/references/mobile/AImhotech%20App.html', { waitUntil: 'networkidle0' });
  
  const takeScreenshot = async (name) => {
    await page.screenshot({ path: `screenshots/${name}.png` });
    console.log(`Saved ${name}.png`);
  };

  fs.mkdirSync('screenshots', { recursive: true });

  await takeScreenshot('01_worker_home');

  const clickButtonByText = async (textToMatch) => {
    await page.evaluate((text) => {
      const btns = Array.from(document.querySelectorAll('button'));
      const target = btns.find(b => b.textContent.includes(text));
      if(target) target.click();
    }, textToMatch);
    await new Promise(r => setTimeout(r, 1000));
  };

  await clickButtonByText('Patient');
  await takeScreenshot('02_patient_home');

  await clickButtonByText('View as new patient');
  await takeScreenshot('03_onboarding_1');
  
  for (let i = 2; i <= 5; i++) {
    await clickButtonByText('Next');
    await takeScreenshot(`03_onboarding_${i}`);
    const text = await page.evaluate(() => document.body.innerText);
    require('fs').writeFileSync(`onboarding_${i}_text.txt`, text);
    console.log(`Saved onboarding ${i} text`);
  }
  
  await clickButtonByText('New screening wizard');
  await takeScreenshot('04_worker_screening');
  
  await browser.close();
})();
