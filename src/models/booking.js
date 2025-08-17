'use strict';
const {
  Model
} = require('sequelize');
const { Enums } = require("../utils/common");
const { BOOKED, CANCELLED, INITIATED, PENDING } = Enums.BOOKING_STATUS;
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Passenger, {
         foreignKey: 'bookingId',
         as: 'passengers',
         onDelete: 'CASCADE',
      });

      this.hasMany(models.Payment, {
        foreignKey: 'bookingId',
        as: 'payments',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Booking.init({
    flightId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    status: DataTypes.ENUM(BOOKED, CANCELLED, INITIATED, PENDING),
    noOfSeats: DataTypes.INTEGER,
    totalCost: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};