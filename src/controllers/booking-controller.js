const { StatusCodes } = require("http-status-codes");

const { SuccessResponse, ErrorResponse} = require("../utils/common");
const { BookingService, PassengerService, TicketService } = require("../services");

const inMemDb = {};

async function createBooking(req, res) {
    try {
        const { flightId, userId, noOfSeats, travellers, departureCity, arrivalCity, departureAirport, arrivalAirport, departureAirportCode, arrivalAirportCode, departureDate, arrivalDate } = req.body;


        if (!flightId || !userId || !noOfSeats || !Array.isArray(travellers) || travellers.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Missing required fields" });
        }

        if (typeof departureCity !== "string" || !departureCity.trim()) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid departureCity" });
        }

        const booking = await BookingService.createBooking({ flightId, userId, noOfSeats, departureCity, arrivalCity, departureAirport, arrivalAirport, departureAirportCode, arrivalAirportCode, departureDate, arrivalDate });

        const passengerResults = [];
        for(let i = 0; i < travellers.length; i++) {
            const p = await PassengerService.createPassenger(
                { bookingId: booking.id, ...travellers[i] },
            )

            const ticket = await TicketService.createTicket(
                { passengerId: p.id, seatId: 3}
            )

            passengerResults.push({passenger: p, ticket});
        }

        SuccessResponse.data = {
            booking,
            passengerResults,
        };
        
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } 
    catch(error) {
        console.error(error);
        ErrorResponse.error = error;

        return res
                .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
                .json(ErrorResponse);
    }
}

async function makePayment(req, res) {
    try {
        /* const idempotencyKey = req.headers["x-idempotency-key"];

        if(!idempotencyKey) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({message: "idempotency key not found in incoming request headers"});
        }

        if(inMemDb[idempotencyKey]) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({message: "Cannot retry on successful payment"});
        } */

        const response = await BookingService.makePayment({
          bookingId: req.body.bookingId,
          userId: req.body.userId,
          totalCost: req.body.totalCost,
        });

        /* inMemDb[idempotencyKey] = idempotencyKey; */
        
        SuccessResponse.data = response;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } 
    catch(error) {
        ErrorResponse.error = error;
        console.error(error);
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

async function getBookingsByUserId(req, res) {
    try {
        const userBookings = await BookingService.getBookingsByUserId(req.params.userId);

        SuccessResponse.data = userBookings;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);

    } catch (error) {
        ErrorResponse.error = error;
        console.error(error);
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

module.exports = {
    createBooking,
    makePayment,
    getBookingsByUserId,
}