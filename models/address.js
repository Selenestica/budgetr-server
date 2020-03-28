'use strict';
module.exports = (sequelize, DataTypes) => {
  const Addresses = sequelize.define('Addresses', {
    line_one: DataTypes.STRING,
    line_two: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip_code: DataTypes.INTEGER,
    suite_apt_po: DataTypes.STRING,
    country: DataTypes.STRING
  }, {});
  Addresses.associate = function(models) {
    // associations can be defined here
    models.Addresses.belongsTo(models.Users, {
      as:'Users',
      foreignKey:'id'
    })
  };
  return Addresses;
};