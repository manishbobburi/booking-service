'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Seats extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Airplane, {
        foreignKey: 'airplaneId',
        onDelete: 'CASCADE',
      });
      this.hasMany(models.Ticket, {
        foreignKey: 'seatId',
        onDelete: 'CASCADE',
      })
    }
  }
  Seats.init({
    airplaneId: DataTypes.INTEGER,
    seatNumber: DataTypes.STRING,
    seatClass: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Seats',
  });
  return Seats;
};