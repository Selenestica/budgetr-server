'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Plaid_Items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      available_products: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      billed_products: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      institution_id: {
        type: Sequelize.STRING
      },
      item_id: {
        type: Sequelize.STRING
      },
      webhook: {
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
    return queryInterface.dropTable('Plaid_Items');
  }
};