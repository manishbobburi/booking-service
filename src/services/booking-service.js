const axios = require("axios");
const { StatusCodes } = require("http-status-codes");
const { AppError } = require("../utils/errors");
const { BookingRepository } = require("../repositories/");
const { ServerConfig } = require("../config");
const db = require("../models");

const bookingRepository = new BookingRepository();
/*
* Un-managed transaction:- createBooking
*/
async function createBooking(data) {
    const transaction = await db.sequelize.transaction();
    try {
        const response = await axios.get(
          `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`
        );
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
        await axios.patch(
            `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,
            {
                seats: data.noOfSeats,
            }
        );
        await transaction.commit();
        return booking;
    } catch (error) {
        await transaction.rollback();
        throw error;
        // throw new AppError("Failed to create booking.", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
module.exports = {
    createBooking,
}