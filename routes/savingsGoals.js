const express = require("express");
const router = express.Router();
const models = require("../models");

router.post("/add-savings-goal", (req, res) => {
  let name = req.body.name,
    type = req.body.type,
    user_id = req.body.user_id,
    deadline_date = req.body.deadline_date,
    amount = req.body.amount;

  const savingsGoal = models.Savings_Goals.build({
    name: name,
    type: type,
    user_id: user_id,
    deadline_date: deadline_date,
    amount: amount,
  });

  savingsGoal.save();
});

router.get("/view-savings-goals", (req, res) => {
  models.Savings_Goals.findAll().then((savings_goals) => {
    res.json({ savings_goals: savings_goals });
  });
});

router.post("/delete-savings-goals/:id", (req, res) => {
  models.Savings_Goals.destroy({
    where: {
      id: req.params.id,
    },
  });
});

module.exports = router;
