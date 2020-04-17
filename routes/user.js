const express = require("express");
const router = express.Router();
const models = require("../models");
global.bcrypt = require("bcrypt");
global.SALT_ROUNDS = 10;
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const crypto = require("crypto");
const config = require("../config/config");

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
      phone_number: phone_number,
    },
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
        const emailVerificationExpiresDate = Date.now();
        const emailVerificationExpires = emailVerificationExpiresDate.toString();

        const user = await models.Users.build({
          first: first,
          last: last,
          email: email,
          phone_number: phone_number,
          password: hash,
          emailVerificationToken: emailVerificationToken,
          emailVerificationExpires: emailVerificationExpires,
        });

        const savedUser = await user.save();

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
          service: config.development.service,
          secure: false,
          auth: {
            user: config.development.user,
            pass: config.development.pass,
          },
        });

        const emailVerificationMessage = `
          <div>
            <p>Welcome to Budgetr!</p>
            <p>Please click the link below to continue your registration. Thanks!</p>
            <a href = http://localhost:3000/verify-email/${email}/${emailVerificationToken}>Verify Email</a>
          </div>
        `;

        const messageSent = await transporter.sendMail({
          from: "joebenwilsonmusic@gmail.com",
          to: email,
          subject: "Welcome to Budgetr!",
          html: emailVerificationMessage,
        });

        if (!messageSent) {
          console.log(
            "There was an error sending the email. Our cyborgs have failed you :("
          );
        } else {
          console.log("Email sent!");
        }

        const token = jwt.sign(
          { email: savedUser.email },
          process.env.SECRET_KEY
        );

        return res.status(200).json({
          savedUser,
          token,
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
  models.Users.findAll().then((users) => {
    res.json({ RegisteredUsers: users });
  });
});

// remove a user
router.post("/delete-user/:id", (req, res) => {
  models.Users.destroy({
    where: {
      id: req.params.id,
    },
  });
});

//====================LOGIN====================//
router.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    await models.Users.findOne({
      where: {
        email: email,
      },
    }).then(function (permUser) {
      if (!permUser) {
        console.log("There isn't a user associated with that email address.");
      } else {
        bcrypt.compare(password, permUser.password, function (err, result) {
          if (result === true) {
            console.log("Success!");
            const token = jwt.sign(
              { email: permUser.email },
              process.env.SECRET_KEY
            );
            return res.status(200).json({ token: token }).end();
          }
        });
      }
    });
  } catch (e) {
    return res.status(500).json({ error: e.toString() }).end();
  }
});

module.exports = router;
