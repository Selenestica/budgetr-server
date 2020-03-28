'use strict';
module.exports = (sequelize, DataTypes) => {
  const Plaid_Items = sequelize.define('Plaid_Items', {
    available_products: DataTypes.ARRAY(DataTypes.STRING),
    billed_products: DataTypes.ARRAY(DataTypes.STRING),
    institution_id: DataTypes.STRING,
    item_id: DataTypes.STRING,
    webhook: DataTypes.STRING
  }, {});
  Plaid_Items.associate = function(models) {
    // associations can be defined here
    models.Plaid_Items.belongsTo(models.Users, {
      as:'Users',
      foreignKey:'id'
    })
  };
  return Plaid_Items;
};