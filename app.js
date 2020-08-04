const moment = require("moment");
const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
  const dateSelect = document.getElementById("date");

  const dates = Array(8).fill().map((_, i) => {
    const d = moment().add(7 - i, 'days').format('MM-DD-YYYY');
    const option = document.createElement("option");
    option.text = d;
    dateSelect.add(option);
  });

  document.getElementById("start-btn").addEventListener("click", () => {
    const date = document.getElementById("date").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    ipcRenderer.sendSync('run-puppeteer', {
      email, password, date
    });
  });
});


