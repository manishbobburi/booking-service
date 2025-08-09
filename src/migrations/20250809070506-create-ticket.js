'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tickets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      passengerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Passengers',
          key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      seatId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Seats',
          key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      ticketNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tickets');
  }
};