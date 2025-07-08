const CrudRepository = require("./crud-repository");
const { Booking } = require("../models");
const { AppError } = require("../utils/errors");

class BookingRepository extends CrudRepository{
    constructor() {
        super(Booking);
    }
    async createBooking(data, transaction) {
        const booking = await Booking.create(data, { transaction: transaction});
        return booking;
    }
}

module.exports = BookingRepository;