const express = require("express");
const router = express.Router();
const models = require("../models");

router.post("/verify-email", async (req, res) => {
  try {
    const { email, token } = req.body;
    //const date = new Date();
    const newUser = await models.Users.update(
      { emailVerified: true },
      {
        where: {
          email: email,
          emailVerificationToken: token,
        },
      }
    );

    return res.status(200).json({ newUser }).end();
  } catch (err) {
    console.log(err);
    return res.status(500);
  }
});

module.exports = router;
