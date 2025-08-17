'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Booking, {
        foreignKey: 'bookingId',
        as: 'booking',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Payment.init({
    bookingId: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    paymentMethod: DataTypes.STRING,
    payment_date: DataTypes.DATE,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};