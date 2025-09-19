'use strict';

const { Enums } = require("../utils/common");
const { BOOKED, CANCELLED, INITIATED, PENDING, FAILED } = Enums.BOOKING_STATUS;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Bookings', 'status', {
      type: Sequelize.ENUM( BOOKED, CANCELLED, INITIATED, PENDING, FAILED),
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Bookings', 'status', {
      type: Sequelize.ENUM(BOOKED, CANCELLED, INITIATED, PENDING),
      allowNull: false,
    });
  }
};
