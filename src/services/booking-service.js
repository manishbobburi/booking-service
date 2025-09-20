const axios = require("axios");
const { StatusCodes } = require("http-status-codes");

const { ServerConfig, Queue } = require("../config");
const { AppError } = require("../utils/errors");
const { Enums } = require("../utils/common");
const { BOOKED, CANCELLED, FAILED } = Enums.BOOKING_STATUS;

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
    } catch (error) {
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

    if(currentTime - bookingTime > 600000) {
      await setBookingAsFailed(bookingDeatils.id);
      throw new AppError("Booking has expired", StatusCodes.BAD_REQUEST);
    }

    if(bookingDeatils.totalCost !== +data.totalCost) {
      throw new AppError("Payment amount doesn't match", StatusCodes.BAD_REQUEST);
    }

    if(bookingDeatils.userId !== +data.userId) {
      throw new AppError("User corresponding to booking doesn't match", StatusCodes.BAD_REQUEST);
    }

    const response = await bookingRepository.updateBooking(data.bookingId, {status: BOOKED}, transaction);

    let updatedBooking = null;

    if(response[0] == 1) {
      updatedBooking = await bookingRepository.get(data.bookingId);
    }
    else {
      throw new AppError("Booking update failed", StatusCodes.INTERNAL_SERVER_ERROR);
    }

    await transaction.commit();

    Queue.sendData({
      recepientEmail: "manishbobburi6148@gmail.com",
      subject: "Flight Booked.",
      text: `Booking successful for flight ${data.bookingId}`,
    });

    return updatedBooking;    
  } catch(error) {
      await transaction.rollback();
      throw error;
  }
}

async function setBookingAsFailed(bookingId, transaction) {
  const bookingDeatils = await bookingRepository.get(bookingId);

  if (bookingDeatils.status == FAILED) {
    await transaction.rollback();
    return { message: "Booking already marked as failed" };
  }

  await axios.patch(
    `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${bookingDeatils.flightId}/seats`,
    {
      seats: bookingDeatils.noOfSeats,
      dec: 0,
    }
  );

  await bookingRepository.updateBooking(
    bookingId,
    { status: FAILED },
    transaction
  );
}

async function cancelOldBookings() {
  const transaction = await db.sequelize.transaction();
  try {
    const timestamp = new Date( Date.now() - 1000 * 300);
    await bookingRepository.cancelOldBookings(timestamp, transaction);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function getBookingsByUserId(userId) {
  try {
    const userBookings = await bookingRepository.getBookingsByUserId(userId);

    if(!userBookings.length) return [];

    return userBookings;

  } catch (error) {
    console.error(error);
    throw new AppError("Failed to retrieve bookings.", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
    createBooking,
    makePayment,
    cancelOldBookings,
    getBookingsByUserId,
}