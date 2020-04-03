"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn("Users", "emailVerificationExpires", {
        type: Sequelize.STRING,
        allowNull: true
      })
      .then(() => {
        queryInterface.addColumn("Users", "passwordResetExpires", {
          type: Sequelize.DATE,
          allowNull: true
        });
      })
      .then(() => {
        queryInterface.addColumn("Users", "emailVerified", {
          type: Sequelize.BOOLEAN,
          allowNull: true
        });
      })
      .then(() => {
        queryInterface.addColumn("Users", "emailVerificationToken", {
          type: Sequelize.STRING,
          allowNull: true
        });
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
      .removeColumn("Users", "emailVerificationExpires")
      .then(() => {
        queryInterface.removeColumn("Users", "passwordResetExpires");
      })
      .then(() => {
        queryInterface.removeColumn("Users", "emailVerified");
      })
      .then(() => {
        queryInterface.removeColumn("Users", "emailVerificationToken");
      });
  }
};
