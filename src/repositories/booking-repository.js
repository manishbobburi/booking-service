const CrudRepository = require("./crud-repository");
const { Booking, Passenger, Ticket } = require("../models");
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

    async getBookingsByUserId(userId) {
        const userBookings = await Booking.findAll({
            where: {
                userId: userId,
                status: "booked",
            },
            attributes: ['id', 'flightId', 'userId', 'status', 'noOfSeats', 'totalCost', 'createdAt', 'departureCity', 'arrivalCity', 'departureAirport', 'arrivalAirport', 'departureAirportCode', 'arrivalAirportCode', 'departureDate', 'arrivalDate'],
            include: [
                {
                    model: Passenger,
                    as: 'passengers',
                    attributes: ['name', 'age', 'idType'],
                    include: {
                        model: Ticket,
                        as: 'tickets',
                        attributes: ['seatId', 'ticketNumber', 'status'],
                    }
                },
            ],
        });
        return userBookings;
    }
}

module.exports = BookingRepository;