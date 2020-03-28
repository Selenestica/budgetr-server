'use strict';
module.exports = (sequelize, DataTypes) => {
  const Expenses = sequelize.define('Expenses', {
    expense_name: DataTypes.STRING,
    type: DataTypes.STRING,
    frequency: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    next_payment_date: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {});
  Expenses.associate = function(models) {
    // associations can be defined here
    models.Expenses.belongsTo(models.Users, {
      as: 'Users',
      foreignKey: 'id'
    })

  };
  return Expenses;
};