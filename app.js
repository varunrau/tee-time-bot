const moment = require("moment");

document.addEventListener("DOMContentLoaded", () => {
  const dateSelect = document.getElementById("date");

  const dates = Array(8).fill().map((_, i) => {
    const d = moment().add(i, 'days').format('MM-DD-YYYY');
    const option = document.createElement("option");
    option.text = d;
    dateSelect.add(option);
  });

  document.getElementById("start-btn").addEventListener("click", () => {
    const date = document.getElementById("date").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const { spawn } = require('child_process');
    const runCmd = spawn("node",["/Users/varun/code/js/tee-time-bot/run.js", email, password, date]);
    runCmd.stdout.on('data', (data) => {
      console.log(data.toString())
    })
  });
});


