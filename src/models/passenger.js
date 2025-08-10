'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Passenger extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Booking, {
        foreignKey: 'bookingId',
        as: 'boooking',
        onDelete: 'CASCADE'
      });
      this.hasMany(models.Ticket, {
        foreignKey: 'passengerId',
        onDelete: 'CASCADE'
      });
    }
  }
  Passenger.init({
    bookingId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    idType: DataTypes.STRING,
    idNumber: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Passenger',
  });
  return Passenger;
};