const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

const mongoose = require("mongoose");
const dbConnectionString = "mongodb://localhost/UserManager";

const port = process.env.PORT || 3000;

mongoose.connect(dbConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  address: {
    country: String,
    zip: String,
  },
  fname: String,
  lname: String,
  email: String,
  age: Number,
  userId: Number,
});

const Users = mongoose.model("newusers", userSchema);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/", (req, res) => {
  Users.find({}, (err, data) => {
    if (err) console.log(err);
    res.render("user", { users: data });
  });
});

app.get("/find/:user", (req, res) => {
  let user = req.params.user;
  Users.find({ fname: user }, (err, data) => {
    if (err) console.log(err);
    let result = JSON.stringify(data);
    res.render("user", { users: result });
    return;
  });
  Users.find({ lname: user }, (err, data) => {
    if (err) console.log(err);
    let result = JSON.stringify(data);
    res.render("user", { users: result });
    return;
  });
  res.render("error");
});

app.get("/edit/:user", (req, res) => {
  let user = req.params.user;
  Users.find({ fname: user }, (err, data) => {
    if (err) console.log(err);
    let result = JSON.stringify(data);
    res.render("edit", { users: result });
    return;
  });
  Users.find({ lname: user }, (err, data) => {
    if (err) console.log(err);
    let result = JSON.stringify(data);
    res.render("edit", { users: result });
    return;
  });
  res.render("error");
});

app.get("/newUser", (req, res) => {
  res.render("new");
});

app.listen(port, () => {
  console.log(`App started and running on Port ${port}`);
});
