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
  Users.find({}, (err, data) => {
    if (err) console.log(err);
    res.render("user", { users: data });
  });
});

app.get("/find/:id", async (req, res) => {
  let id = req.params.id;
  console.log(`User Finding: ${id}`);

  Users.find({ _id: id }, (err, data) => {
    if (data.length == 0) {
      console.log(`${id} not found.`);
      res.render("error");
      return;
    } else {
      console.log("User Found by ID");
      if (err) console.log(err);
      console.log(data);
      res.render("user", { users: data });
      return;
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
    { new: true, upsert: true }
  );
  console.log("Updated User...");
  // console.log(updatedUser);
  res.send("User Updated");
});

app.get("/newUser", (req, res) => {
  res.render("new");
});

app.listen(port, () => {
  console.log(`App started and running on Port ${port}`);
});

// function FindUser(findName) {
//   Users.find({ fname: findName }, (err, data) => {
//     if (data.length == 0) {
//       Users.find({ lname: findName }, (err, data) => {
//         if (data.length == 0) {
//           console.log(`${findName} not found.`);
//           return "ERROR";
//         }
//         console.log("User Found by Last Name");
//         if (err) console.log(err);
//         console.log(data[0]);
//         return data[0];
//       });
//     } else {
//       console.log("User Found by First Name");
//       if (err) console.log(err);
//       console.log(data[0]);
//       return data[0];
//     }
//   });
// }
