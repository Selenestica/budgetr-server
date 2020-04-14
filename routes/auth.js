const express = require("express");
const router = express.Router();
const models = require("../models");

router.post("/verify-email", async (req, res) => {
  try {
    const { email, token } = req.body;
    const date = new Date();
    const newUser = models.Users.findOne({
      where: {
        email: email,
        emailVerificationToken: token,
      },
    });

    //const emailVerificationExpires = Number(newUser.emailVerificationExpires);
    //console.log(emailVerificationExpires);
    console.log(newUser);

    if (newUser) {
      models.Users.update(
        { emailVerified: true },
        {
          where: {
            email: email,
            emailVerificationToken: token,
          },
        }
      );
    }

    console.log(newUser);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
