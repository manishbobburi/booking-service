'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      queryInterface.addColumn(
        'Bookings',
        'departureCity',
        {
          type: Sequelize.STRING,
          allowNull: false,
        }
      ),
      queryInterface.addColumn(
        'Bookings',
        'arrivalCity',
        {
          type: Sequelize.STRING,
          allowNull: false,
        }
      ),
      queryInterface.addColumn(
        'Bookings',
        'departureAirport',
        {
          type: Sequelize.STRING,
          allowNull: false,
        }
      ),
      queryInterface.addColumn(
        'Bookings',
        'arrivalAirport',
        {
          type: Sequelize.STRING,
          allowNull: false,
        }
      ),
      queryInterface.addColumn(
        'Bookings',
        'departureAirportCode',
        {
          type: Sequelize.STRING,
          allowNull: false,
        }
      ),
      queryInterface.addColumn(
        'Bookings',
        'arrivalAirportCode',
        {
          type: Sequelize.STRING,
          allowNull: false,
        }
      ),
      queryInterface.addColumn(
        'Bookings',
        'departureDate',
        {
          type: Sequelize.DATE,
        }
      ),
      queryInterface.addColumn(
        'Bookings',
        'arrivalDate',
        {
          type: Sequelize.DATE,
        }
      )
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */return Promise.all([
      queryInterface.removeColumn('Bookings', 'departureCity'),
      queryInterface.removeColumn('Bookings', 'arrivalCity'),
      queryInterface.removeColumn('Bookings', 'departureAirport'),
      queryInterface.removeColumn('Bookings', 'arrivalAirport'),
      queryInterface.removeColumn('Bookings', 'departureAirportCode'),
      queryInterface.removeColumn('Bookings', 'arrivalAirportCode'),
      queryInterface.removeColumn('Bookings', 'departureDate'),
      queryInterface.removeColumn('Bookings', 'arrivalDate')
    ]);
  }
};
