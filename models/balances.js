'use strict';
module.exports = (sequelize, DataTypes) => {
  const Balances = sequelize.define('Balances', {
    available: DataTypes.INTEGER,
    current: DataTypes.INTEGER,
    limit: DataTypes.INTEGER,
    iso_currency_code: DataTypes.STRING,
    unofficial_currency_code: DataTypes.STRING
  }, {});
  Balances.associate = function(models) {
    // associations can be defined here
    models.Balances.belongsTo(models.Plaid_Accounts, {
      as:'Plaid_accounts',
      foreignKey:'id'
    })
  };
  return Balances;
};