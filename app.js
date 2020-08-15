const moment = require("moment");
const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
  const dateSelect = document.getElementById("date");

  const dates = Array(8)
    .fill()
    .map((_, i) => {
      const d = moment()
        .add(7 - i, "days")
        .format("MM-DD-YYYY");
      const option = document.createElement("option");
      option.text = d;
      dateSelect.add(option);
    });

  // 10:00am - 3:00pm
  const hourSelect = document.getElementById("hour");
  const hours = Array(10)
    .fill()
    .map((_, i) => {
      let hour = (10 + i) % 12;
      hour = hour === 0 ? 12 : hour;
      const option = document.createElement("option");
      option.text = `${hour}:00${[10, 11].includes(hour) ? "am" : "pm"}`;
      hourSelect.add(option);

      const optionHalf = document.createElement("option");
      optionHalf.text = `${hour}:30${[10, 11].includes(hour) ? "am" : "pm"}`;
      hourSelect.add(optionHalf);
    });
  hourSelect.value = "11:00am";

  document.getElementById("start-btn").addEventListener("click", () => {
    const date = document.getElementById("date").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const hour = document.getElementById("hour").value;
    ipcRenderer.sendSync("run-puppeteer", {
      email,
      password,
      date,
      hour,
    });
  });
});
