'use strict';
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    first: DataTypes.STRING,
    last: DataTypes.STRING,
    email: DataTypes.STRING,
    phone_number: DataTypes.INTEGER,
    password: DataTypes.STRING,
    display_name: DataTypes.STRING,
    profile_picture_url: DataTypes.STRING
  }, {});
  Users.associate = function(models) {
    // associations can be defined here
    Users.hasMany(models.Addresses, {
      as: 'Addresses', 
      foreignKey: 'user_id'
    })

    Users.hasMany(models.Expenses, {
      as: 'Expenses',
      foreignKey: 'user_id'
    })

    Users.hasMany(models.Income_Sources, {
      as: 'Income_Sources',
      foreignKey: 'user_id'
    })

    Users.hasMany(models.Savings_Goals, {
      as: 'Savings_Goals',
      foreignKey: 'user_id'
    })

    Users.hasMany(models.Plaid_Accounts, {
      as: 'Plaid_Accounts',
      foreignKey: 'user_id'
    })

    Users.hasMany(models.Plaid_Items, {
      as: 'Plaid_Items',
      foreignKey: 'user_id'
    })

  };
  return Users;
};

