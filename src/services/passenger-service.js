const { StatusCodes } = require("http-status-codes");

const { Errors: { AppError } } = require("../utils");
const { PassengerRepository } = require("../repositories");

const passengerRepository = new PassengerRepository();

async function createPassenger(data) {
    try {
        const passenger = await passengerRepository.create(data);
        return passenger;
    } catch (error) {
        throw new AppError("Failed to create passenger", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createPassenger,
}