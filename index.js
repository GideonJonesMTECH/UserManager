const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

const mongoose = require("mongoose");
const { runInNewContext } = require("vm");
const dbConnectionString = "mongodb://localhost/UserManager";

const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));

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
});

const Users = mongoose.model("newusers", userSchema);
mongoose.set("useFindAndModify", false);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/", (req, res) => {
  console.log("Home");
  Users.find({}, null, { sort: { lname: -1 } }, (err, data) => {
    if (err) console.log(err);
    res.render("user", { users: data });
  });
});

app.get("/sort", (req, res) => {
  console.log("Sort");
  res.render("sortOptions");
});

app.get("/sort/:sorting/:acendOrDecend", (req, res) => {
  let sorting = req.params.sorting;
  let acendOrDecend = req.params.acendOrDecend;
  let acendNumb = 0;

  if (acendOrDecend == "acending") {
    acendNumb = 1;
  } else {
    acendNumb = -1;
  }
  switch (sorting) {
    case "fname":
      Users.find({}, null, { sort: { fname: acendNumb } }, (err, data) => {
        if (err) console.log(err);
        res.render("user", { users: data });
      });
      break;
    case "lname":
      Users.find({}, null, { sort: { lname: acendNumb } }, (err, data) => {
        if (err) console.log(err);
        res.render("user", { users: data });
      });
      break;
    case "email":
      Users.find({}, null, { sort: { email: acendNumb } }, (err, data) => {
        if (err) console.log(err);
        res.render("user", { users: data });
      });
      break;
    case "age":
      Users.find({}, null, { sort: { age: acendNumb } }, (err, data) => {
        if (err) console.log(err);
        res.render("user", { users: data });
      });
      break;
    case "zip":
      Users.find({}, null, { sort: { zip: acendNumb } }, (err, data) => {
        if (err) console.log(err);
        res.render("user", { users: data });
      });
      break;
    case "country":
      Users.find({}, null, { sort: { country: acendNumb } }, (err, data) => {
        if (err) console.log(err);
        res.render("user", { users: data });
      });
      break;
    case "id":
      Users.find({}, null, { sort: { id: acendNumb } }, (err, data) => {
        if (err) console.log(err);
        res.render("user", { users: data });
      });
      break;
    default:
      break;
  }
});

app.get("/find/:user", async (req, res) => {
  let user = req.params.user;
  console.log(`User Finding: ${user}`);

  Users.find({ fname: user }, (err, data) => {
    //attempt to find by first name
    if (data.length == 0) {
      //cannot find by firstname
      Users.find({ lname: user }, (err, data) => {
        //attempt to find by last name
        if (data.length == 0) {
          //cannot find by lastname
          console.log(`${user} not found.`);
          res.render("error"); //cannot find user
        } else {
          //found by lastname
          console.log("User Found by Last Name");
          if (err) console.log(err);
          res.render("user", { users: data }); //render all with lastname
        }
      });
    } else {
      //found by firstname
      console.log("User Found by First Name");
      if (err) console.log(err);
      console.log(data);
      res.render("user", { users: data }); //render all with firstname
    }
  });
});

app.get("/edit/:id", async (req, res) => {
  let id = req.params.id;
  console.log(`User Finding: ${id}`);
  Users.find({ _id: id }, (err, data) => {
    if (data.length == 0) {
      res.render("error");
      if (err) console.log(err);
      return;
    } else {
      console.log("User Found by id");
      if (err) console.log(err);
      res.render("edit", { users: data[0] });
    }
  });
});

app.post("/edit/:id", (req, res) => {
  let user = req.params.id;
  console.log(`Editing ${user}`);
  console.log(`Zip: ${req.body.zip}`);
  Users.findByIdAndUpdate(
    user,
    {
      _id: user,
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      age: req.body.age,
      address: {
        country: req.body.country,
        zip: req.body.zip,
      },
    },
    { new: true, upsert: true },
    (err, data) => {
      res.render("success", { message: "Edited" });
    }
  );
});

app.get("/newUser", (req, res) => {
  res.render("new");
});

app.post("/newUser", (req, res) => {
  console.log(`Creating ${req.body.fname}`);
  Users.create(
    {
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      age: req.body.age,
      address: {
        country: req.body.country,
        zip: req.body.zip,
      },
    },
    (err, data) => {
      res.render("success", { message: "Created" });
    }
  );
});

app.get("/delete", (req, res) => {
  let id = req.body.id;
  Users.find({ _id: id }, (err, data) => {
    if (data.length == 0) {
      res.render("error");
      if (err) console.log(err);
    } else {
      console.log("User Found by id");
      if (err) console.log(err);
      res.render("delete", { users: data[0] });
    }
  });
});

app.post("/delete", (req, res) => {
  let id = req.body.id;
  Users.findByIdAndDelete(id, (err, data) => {
    res.render("success", { message: "Deleted" });
  });
});

app.listen(port, () => {
  console.log(`App started and running on Port ${port}`);
});
