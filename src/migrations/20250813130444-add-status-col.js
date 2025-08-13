'use strict';

const { Common: { Enums: { TICKET_STATUS: { ACTIVE, CANCELLED, VOIDED, USED } } } } = require("../utils/");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.addColumn('Tickets', 'status', {
        type: Sequelize.ENUM(ACTIVE, CANCELLED, USED, VOIDED),
        allowNull: false,
        defaultValue: ACTIVE
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Tickets', 'status');
  }
};
