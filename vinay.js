const express = require("express");
const app = express();
const port = 8000;
const passwordhash = require("password-hash");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const serviceAccount = require("./key.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
app.set("view engine", "ejs");

let userData = [];

app.use((req, res, next) => {
  db.collection("SIGNUP")
    .get()
    .then((docs) => {
      userData = [];
      docs.forEach((doc) => {
        userData.push(doc.data());
      });
      next();
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
      res.sendStatus(500);
    });
});
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/loginsubmit", (req, res) => {
  const email = req.query.email;

  db.collection("SIGNUP")
    .where("email", "==", email)
    .get()
    .then((docs) => {
      let result = false;
      docs.forEach((doc) => {
        const hashp = doc.data().password;
        result = passwordhash.verify(req.query.password, hashp);
        if (result) {
          if (email == "vinaythanay@gmail.com" && req.query.password == "987654") {
            res.render("home", { userData: userData });
          } else {
            res.render("planet");
          }
        }
        else {
          res.render("login_fail");
        }
      })
      
    })
    .catch((error) => {
      console.error("Error during login:", error);
      res.sendStatus(500);
    });
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signupsubmit", (req, res) => {
  const full_name = req.body.fullname;
  const email = req.body.email;
  const password = req.body.password;

  db.collection("SIGNUP")
    .where("email", "==", email)
    .get()
    .then((docs) => {
      if (docs.size > 0) {
        res.render("signup_fail");
      } else {
        db.collection("SIGNUP")
          .where("fullname", "==", full_name)
          .get()
          .then((docs) => {
            if (docs.size > 0) {
              res.render("signup_fail");
            } else {
              db.collection("SIGNUP")
                .add({
                  name: full_name,
                  email: email,
                  password: passwordhash.generate(password),
                })
                .then(() => {
                  res.render("signup_success");
                })
                .catch((error) => {
                  console.error("Error adding user: ", error);
                  res.render("signup_fail", { message: "Error signing up" });
                });
            }
          })
          .catch((error) => {
            console.error("Error checking name: ", error);
            res.render("signup_fail", { message: "Error signing up" });
          });
      }
    })
    .catch((error) => {
      console.error("Error checking email: ", error);
      res.render("signup_fail", { message: "Error signing up" });
    });
});
app.get("/OurSolarSystem", (req, res) => {
  res.sendFile(__dirname + "/views/OurSolarSystem.html");
});
app.get("/eris", (req, res) => {
  res.sendFile(__dirname + "/views/eris.html");
});
app.get("/neptune", (req, res) => {
  res.sendFile(__dirname + "/views/neptune.html");
});
app.get("/saturn", (req, res) => {
  res.sendFile(__dirname + "/views/saturn.html");
});
app.get("/jupiter", (req, res) => {
  res.sendFile(__dirname + "/views/jupiter.html");
});
app.get("/uranus", (req, res) => {
  res.sendFile(__dirname + "/views/uranus.html");
});
app.get("/mars", (req, res) => {
  res.sendFile(__dirname + "/views/mars.html");
});
app.get("/pluto", (req, res) => {
  res.sendFile(__dirname + "/views/pluto.html");
});
app.get("/haumea", (req, res) => {
  res.sendFile(__dirname + "/views/haumea.html");
});
app.get("/:planetOrMoon", (req, res) => {
  const planetOrMoon = req.params.planetOrMoon;
  if (planetOrMoon === "planet") {
    res.render("planet", { userData: userData });
  } else {
    res.sendFile(__dirname + `/views/${planetOrMoon}`);
  }
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
