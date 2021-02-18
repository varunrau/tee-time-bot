const puppeteer = require("puppeteer");
const moment = require("moment");
const fs = require("fs")
const os = require("os")

const credentials = fs.readFileSync(`${os.homedir()}/teetimebot.json`)
const credsJSON = JSON.parse(credentials)
const { email, password } = credsJSON

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run(date, hour) {
  const browser = await puppeteer.launch({
    headless: false,
  });

  // Log in for torrey pines
  const page = await browser.newPage();
  await page.goto("https://foreupsoftware.com/index.php/booking/19347/1468", {
    waitUntil: "networkidle2",
  });
  await page.type("#login_email", email);
  await page.type("#login_password", password);
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle2" }),
    page.click("#submit_button", { delay: 500 }),
  ]);
  console.log("logging into account");

  await page.goto(
    "https://foreupsoftware.com/index.php/booking/19347/1468#/teetimes",
    { waitUntil: "networkidle2" }
  );

  console.log("going to page");

  await page.waitFor(5000);
  await page.click(".booking-classes button:nth-child(6)", { delay: 500 });

  await sleep(5000);
  console.log("waited for 5 seconds");

  console.log("on the teesheet page");

  // select 4 players
  await page.click(".players :nth-child(4)");
  console.log("selected 4 players");

  // select date
  await page.select("select#date-menu", date);
  console.log("selected date");

  await page.click(".holes :nth-child(1)", { delay: 500 });

  let teeTimes = [];
  let teeTimeIndex = -1;

  do {
    teeTimeIndex = await page.evaluate((hour) => {
      const teeTimes = document.querySelectorAll(".reserve-time .start");
      const times = Array.from(teeTimes, (el) => el.innerText);
      console.log("times", times);
      const filteredTimes = times.filter((time) => {
        return moment(time, "H:mm") >= moment(hour, "H:mm");
      });
      console.log("filteredTimes", filteredTimes);
      if (filteredTimes.length > 0) {
        return times.indexOf(filteredTimes[0]);
      }
      if (times.length > 0) {
        return 0;
      }
      console.log("didn't find any tee times - waiting for 300 milliseconds");
      return -1;
    }, hour);
    await Promise.all([sleep(300), page.click(".holes :nth-child(1)")]);
  } while (teeTimeIndex === -1);

  console.log("index", teeTimeIndex);

  await page.click(`#times li:nth-child(${teeTimeIndex + 1})`);

  while (true) {
    try {
      await Promise.all([
        sleep(100),
        page.click(`#times li:nth-child(${teeTimeIndex + 1})`),
      ]);
    } catch {}
  }
}

module.exports = {
  run: run,
};
