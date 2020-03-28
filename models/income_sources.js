'use strict';
module.exports = (sequelize, DataTypes) => {
  const Income_Sources = sequelize.define('Income_Sources', {
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    frequency: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    next_payment_date: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {});
  Income_Sources.associate = function(models) {
    // associations can be defined here
    models.Income_Sources.belongsTo(models.Users, {
      as: 'Users',
      foreignKey: 'id'
    })
  };
  return Income_Sources;
};