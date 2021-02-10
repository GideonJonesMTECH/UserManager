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
  userId: Number,
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

app.get("/find/:user", async (req, res) => {
  let user = req.params.user;
  console.log(`User Finding: ${user}`);

  Users.find({ fname: user }, (err, data) => {
    if (data.length == 0) {
      Users.find({ lname: user }, (err, data) => {
        if (data.length == 0) {
          console.log(`${user} not found.`);
          res.render("error");
          return;
        }
        console.log("User Found by Last Name");
        if (err) console.log(err);
        res.render("user", { users: data });
        return;
      });
    } else {
      console.log("User Found by First Name");
      if (err) console.log(err);
      console.log(data);
      res.render("user", { users: data });
      return;
    }
  });

  // let foundResults = await FindUser(user);
  // res.render("user", { users: foundResults });
});

app.get("/edit/:user", async (req, res) => {
  let user = req.params.user;
  console.log(`User Finding: ${user}`);
  Users.find({ fname: user }, (err, data) => {
    if (data.length == 0) {
      Users.find({ lname: user }, (err, data) => {
        if (data.length == 0) {
          console.log(`${user} not found.`);
          res.render("error");
          return;
        }
        console.log("User Found by Last Name");
        if (err) console.log(err);
        res.render("edit", { users: data });
        return;
      });
    } else {
      console.log("User Found by First Name");
      if (err) console.log(err);
      res.render("edit", { users: data[0] });
      return;
    }
  });
  // let foundResults = await FindUser(user);
  // res.render("edit", { users: foundResults });
});

app.post("/edit/:user", (req, res) => {
  let user = req.params.user;
  console.log(`Editing ${user}`);
  let userId = "";

  Users.find({ fname: user }, (err, data) => {
    if (data.length == 0) {
      Users.find({ lname: user }, (err, data) => {
        if (data.length == 0) {
          console.log(`${user} not found.`);
          res.render("error");
          return;
        }
        console.log("User Found by Last Name");
        if (err) console.log(err);
        userId = data[0]._id;
        return;
      });
    } else {
      console.log("User Found by First Name");
      if (err) console.log(err);
      console.log(data);
      userId = data[0]._id;
      return;
    }
  });

  let updatedUser = Users.findOneAndUpdate(
    { _id: userId },
    {
      _id: userId,
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
  console.log(updatedUser);
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
