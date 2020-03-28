'use strict';
module.exports = (sequelize, DataTypes) => {
  const Savings_Goals = sequelize.define('Savings_Goals', {
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    deadline_date: DataTypes.INTEGER,
    amount: DataTypes.INTEGER
  }, {});
  Savings_Goals.associate = function(models) {
    // associations can be defined here
    models.Savings_Goals.belongsTo(models.Users, {
      as: 'Users',
      foreignKey: 'id'
    })
  };
  return Savings_Goals;
};