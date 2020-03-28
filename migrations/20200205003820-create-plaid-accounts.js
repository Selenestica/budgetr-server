'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Plaid_Accounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mask: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      official_name: {
        type: Sequelize.STRING
      },
      subtype: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      account_id: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Plaid_Accounts');
  }
};