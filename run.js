const puppeteer = require('puppeteer');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async function run() {
  if (process.argv.length < 5) {
    console.log("not enough arguments")
    return;
  }

  const email = process.argv[2];
  const password = process.argv[3];
  const date = process.argv[4];

  const browser = await puppeteer.launch({
    headless: false,
  });

  // Log in for torrey pines
  const page = await browser.newPage();
  await page.goto('https://foreupsoftware.com/index.php/booking/19347/1468', {waitUntil: 'networkidle2'});
  await page.type('#login_email', email)
  await page.type('#login_password', password)
  await Promise.all([
    page.waitForNavigation({waitUntil: 'networkidle2'}),
    page.click('#submit_button', {delay: 500}),
  ]);
  console.log("logging into account")

  await page.goto('https://foreupsoftware.com/index.php/booking/19347/1468#/teetimes', {waitUntil: 'networkidle2'});

  console.log("going to page")

  await page.click('.booking-classes button:nth-child(4)', {delay: 500})

  await sleep(5000)
  console.log("waited for 5 seconds")

  console.log("on the teesheet page")

  // select 4 players
  await page.click('.players :nth-child(4)')
  console.log('selected 4 players')

  await page.click('.time :nth-child(2)')
  console.log('selected midday')

  // select date
  await page.select('select#date-menu', date)
  console.log('selected date')

  await page.click('.holes :nth-child(1)', {delay: 500})

  let teeTimes = await page.evaluate(() => {
    const teeTimes = document.querySelectorAll(".reserve-time .start")
    console.log('tee times on page', teeTimes)
    return Array.from(teeTimes, el => el.innerText)
  })
  console.log('tee times', teeTimes)

  while (teeTimes.length == 0) {
    console.log("didn't find any tee times - waiting for one second")
    await sleep(200);
    await page.click('.holes :nth-child(1)', {delay: 500})

    teeTimes = await page.evaluate(() => {
      const teeTimes = document.querySelectorAll(".reserve-time .start")
      console.log('tee times on page', teeTimes)
      return Array.from(teeTimes, el => el.innerText)
    })
  }

  await page.click('.reserve-time .start')
})();

console.log(process.argv[2])
