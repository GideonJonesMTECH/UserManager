"use strict";

var express = require("express");

var fs = require("fs");

var app = express();
app.set("views", "./views");
app.set("view engine", "pug");
app.get("/", function (req, res) {
  fs.readFile("/users.json", "utf-8", function (err, data) {
    if (err) {
      throw err;
    }

    var parsedData = JSON.parse(data);
    console.log(parsedData);
  });
  res.render("index", {
    users: {},
    date: new Date()
  });
});
app.listen(3000, function () {
  console.log("Listening on port 3000");
});