const express = require("express");
const router = express.Router();
const models = require("../models");
global.bcrypt = require("bcrypt");
global.SALT_ROUNDS = 10;
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const crypto = require("crypto");

//====================REGISTER====================//
router.post("/register", async (req, res) => {
  let first = req.body.first,
    last = req.body.last,
    email = req.body.email,
    phone_number = req.body.phone_number,
    password = req.body.password;

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
        // creating an email verification token
        const emailVerificationToken = crypto.randomBytes(20).toString("hex");

        // the token expires in one day
        const emailVerificationExpires = new Data(Date.now() + 86400000);

        const user = models.Users.build({
          first: first,
          last: last,
          email: email,
          phone_number: phone_number,
          password: hash,
          emailVerificationToken: emailVerificationToken,
          emailVerificationExpires: emailVerificationExpires
        });
        const savedUser = await user.save();

        await console.log(savedUser);
        if (savedUser !== null) {
          console.log("User registered!");
        } else {
          res.send(
            "There is already a user who has registered with that information ¯_(ツ)_/¯"
          );
        }

        // sending email to verify provided email address
        console.log("Sending email to verify provided email address...");

        const transporter = nodemailer.createTransport({
          service: config.email.service,
          secure: false,
          auth: {
            user: config.email.user, // ethereal user
            pass: config.email.password // ethereal password
          }
        });

        const emailVerificationMessage = `
          <div>
            <p>Welcome to Budgetr!</p>
            <p>Please click the link below to continue your registration. Thanks!</p>
            <a href = http://localhost:3000/verifyEmail/${email}/${emailVerificationToken}>Verify Email</a>
          </div>
        `;

        const messageSent = await transporter.sendMail({
          from: "joebenwilsonmusic@gmail.com",
          to: email,
          subject: "Welcome to Budgetr!",
          html: emailVerificationMessage
        });

        if (!messageSent) {
          console.log(
            "There was an error sending the email. Our cyborgs have failed you :("
          );
        }

        const token = jwt.sign({
          ...savedUser
        });

        return res.status(200).json({
          savedUser,
          token
        });
      }
    });
  } else {
    res.send(
      "There is already a user who has registered with that information ¯_(ツ)_/¯"
    );
  }
});

// see all registered users. delete this one XD
router.get("/view-users", (req, res) => {
  models.Users.findAll().then(users => {
    res.json({ RegisteredUsers: users });
  });
});

// remove a user
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
