const CrudRepository = require("./crud-repository");
const { Booking } = require("../models");
const { Op } = require("sequelize");

const { Enums } = require("../utils/common");
const { BOOKED, CANCELLED } = Enums.BOOKING_STATUS;

class BookingRepository extends CrudRepository{
    constructor() {
        super(Booking);
    }
    async createBooking(data, transaction) {
        const booking = await Booking.create(data, { transaction: transaction});
        return booking;
    }
    
    async updateBooking(id, data, transaction) {
        const response = await Booking.update(data, {
            where: {
                 id: id 
                }
            },
             { transaction: transaction}
        );
        return response;
    }

    async cancelOldBookings(timestamp) {
        await Booking.update({status: CANCELLED}, {
            where: {
                [Op.and]: [
                    {
                        createdAt: {[Op.lt] : timestamp,}
                    },
                    {
                        status: {[Op.ne]: BOOKED,}
                    },
                    {
                        status: {[Op.ne]: CANCELLED,}
                    }
                ]
            }
        });
    }
}

module.exports = BookingRepository;