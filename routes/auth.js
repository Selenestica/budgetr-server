/*
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
  }
});

module.exports = router;
*/
