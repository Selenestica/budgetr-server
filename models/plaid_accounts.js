'use strict';
module.exports = (sequelize, DataTypes) => {
  const Plaid_Accounts = sequelize.define('Plaid_Accounts', {
    mask: DataTypes.STRING,
    name: DataTypes.STRING,
    official_name: DataTypes.STRING,
    subtype: DataTypes.STRING,
    type: DataTypes.STRING,
    account_id: DataTypes.STRING
  }, {});
  Plaid_Accounts.associate = function(models) {
    // associations can be defined here
    models.Plaid_Accounts.belongsTo(models.Users, {
      as:'Users',
      foreignKey:'id'
    })

    models.Plaid_Accounts.hasMany(models.Balances, {
      as: 'Balances',
      foreignKey: 'account_id'
    })
  };
  return Plaid_Accounts;
};