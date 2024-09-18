const express = require("express");
const fs = require("fs");
const app = express();

app.use((req, res, next) => {
  // write your logging code here
  const logObj = {
    Agent: req.header("user-agent").replace(",", " "),
    Time: new Date().toISOString(),
    Method: req.method,
    Resource: req.path,
    Version: `HTTP/${req.httpVersion}`,
    Status: res.statusCode,
  };

  console.log(Object.values(logObj).join(","));
  const logStr = "\n" + Object.values(logObj).join(",");
  fs.appendFile("log.csv", logStr, () => {});

  next();
});

app.get("/", (req, res) => {
  // write your code to respond "ok" here
  res.send("ok").status(200);
});

app.get("/logs", (req, res) => {
  // write your code to return a json object containing the log data here
  fs.readFile("log.csv", "utf8", (err, data) => {
    const logs = [];

    const [headers, ...rows] = data.split("\n");
    const headersArr = headers.split(",");

    for (const row of rows) {
      const obj = {};
      for (i in headersArr) {
        obj[headersArr[i]] = row.split(",")[i];
      }
      logs.push(obj);
    }

    res.json(logs);
  });
});

module.exports = app;
