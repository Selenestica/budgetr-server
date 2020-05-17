const express = require("express");
const router = express.Router();
const models = require("../models");

router.get("/checking", async (req, res) => {
  try {
    const checkingInfo = await models.Checking_Accounts.findAll();
    return res.json(checkingInfo).status(200).end();
  } catch (e) {
    console.log(e.toString());
    return res.status(500);
  }
});

module.exports = router;
