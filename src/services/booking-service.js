const axios = require("axios");
const { StatusCodes } = require("http-status-codes");

const { ServerConfig } = require("../config");
const { AppError } = require("../utils/errors");
const { Enums } = require("../utils/common");
const { BOOKED, CANCELLED } = Enums.BOOKING_STATUS;

const db = require("../models");
const { BookingRepository } = require("../repositories/");
const bookingRepository = new BookingRepository();

async function createBooking(data) {

  const transaction = await db.sequelize.transaction();

    try {
      const response = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);

      const flightData = response.data?.data || response.data;

      if (data.noOfSeats > flightData.totalSeats) {
        throw new AppError("Not enough seats available",StatusCodes.BAD_REQUEST);
      }

      const totalBillingAmount = data.noOfSeats * flightData.price;
      const bookingPayload = { ...data, totalCost: totalBillingAmount };
      const booking = bookingRepository.createBooking(
        bookingPayload,
        transaction
      );

      await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,{seats: data.noOfSeats});

      await transaction.commit();
      
      return booking;
    } 
    catch (error) {
      await transaction.rollback();
      throw error;
    }
}

async function makePayment(data) {

  const transaction = await db.sequelize.transaction();

  try {
    const bookingDeatils = await bookingRepository.get(data.bookingId);

    if(bookingDeatils.status == CANCELLED) {
      throw new AppError("Booking has expired", StatusCodes.BAD_REQUEST);
    }

    const bookingTime = new Date(bookingDeatils.createdAt);
    const currentTime = new Date();

    if(currentTime - bookingTime > 500000) {
      await bookingRepository.updateBooking(data.bookingId, {status: CANCELLED}, transaction);
      throw new AppError("Booking has expired", StatusCodes.BAD_REQUEST);
    }

    if(bookingDeatils.totalCost !== +data.totalCost) {
      throw new AppError("Payment amount doesn't match", StatusCodes.BAD_REQUEST);
    }

    if(bookingDeatils.userId !== +data.userId) {
      throw new AppError("User corresponding to booking doesn't match", StatusCodes.BAD_REQUEST);
    }

    await bookingRepository.updateBooking(data.bookingId, {status: BOOKED}, transaction);

    await transaction.commit();
  } 
  catch(error) {
    await transaction.rollback();
    throw error;
  }
}

module.exports = {
    createBooking,
    makePayment,
}