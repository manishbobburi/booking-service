const CrudRepository = require("./crud-repository");
const { Booking } = require("../models");

class BookingRepository extends CrudRepository{
    constructor() {
        super(Booking);
    }
    async createBooking(data, transaction) {
        const booking = await Booking.create(data, { transaction: transaction});
        return booking;
    }
    
    async updateBooking(id, data, transaction) {
        const response = await Booking.update(data, {where: { id: id }}, { transaction: transaction});
        return response;
    }
}

module.exports = BookingRepository;