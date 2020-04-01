const express = require("express");
const router = express.Router();
const models = require("../models");
global.bcrypt = require("bcrypt");
global.SALT_ROUNDS = 10;

//====================REGISTER====================//
router.post("/register", async (req, res) => {
  let first = req.body.first,
    last = req.body.last,
    email = req.body.email,
    phone_number = req.body.phone_number,
    password = req.body.password,
    display_name = req.body.display_name,
    profile_picture_url = req.body.profile_picture_url;

  let persistedUser = await models.Users.findOne({
    where: {
      first: first,
      last: last,
      email: email,
      phone_number: phone_number
    }
  });

  // registers user if they don't exist
  if (persistedUser === null) {
    bcrypt.hash(password, SALT_ROUNDS, async (error, hash) => {
      if (error) {
        console.log(error);
        res.send("Error creating user ¯_(ツ)_/¯");
      } else {
        let user = models.Users.build({
          first: first,
          last: last,
          email: email,
          phone_number: phone_number,
          password: hash,
          display_name: display_name,
          profile_picture_url: profile_picture_url
        });
        let savedUser = await user.save();

        await console.log(savedUser);
        if (savedUser !== null) {
          res.redirect("/login");
        } else {
          res.send(
            "There is already a user who has registered with that information ¯_(ツ)_/¯"
          );
        }
      }
    });
  } else {
    res.send(
      "There is already a user who has registered with that information ¯_(ツ)_/¯"
    );
  }
});

router.get("/view-users", (req, res) => {
  models.Users.findAll().then(users => {
    res.json({ RegisteredUsers: users });
  });
});

router.post("/delete-user/:id", (req, res) => {
  models.Users.destroy({
    where: {
      id: req.params.id
    }
  });
});

//====================LOGIN====================//
router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  let permUser = await models.Users.findOne({
    where: {
      email: email
    }
  }).then(function(permUser) {
    if (!permUser) {
      console.log("nope");
    } else {
      bcrypt.compare(password, permUser.password, function(err, result) {
        if (result == true) {
          console.log(permUser.password);
          const token = jwt.sign(
            { email: permUser.email },
            process.env.SECRET_KEY
          );
          res.json({ token: token });
        } else {
          console.log("incorrect");
        }
      });
    }
  });
});

module.exports = router;
