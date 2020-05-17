'use strict';
module.exports = (sequelize, DataTypes) => {
  const Checking_Accounts = sequelize.define('Checking_Accounts', {
    owner_id: DataTypes.STRING,
    available_funds: DataTypes.STRING,
    current_funds: DataTypes.STRING
  }, {});
  Checking_Accounts.associate = function(models) {
    // associations can be defined here
  };
  return Checking_Accounts;
};