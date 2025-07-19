const { StatusCodes } = require("http-status-codes");

const { SuccessResponse, ErrorResponse} = require("../utils/common");
const { BookingService } = require("../services");

const inMemDb = {};

async function createBooking(req, res) {
    try {
        const booking = await BookingService.createBooking({
            flightId: req.body.flightId,
            userId: req.body.userId,
            noOfSeats: req.body.noOfSeats,
        });

        SuccessResponse.data = booking;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } 
    catch(error) {
        ErrorResponse.error = error;

        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

async function makePayment(req, res) {
    try {
        const idempotencyKey = req.headers["x-idempotency-key"];

        if(!idempotencyKey) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({message: "idempotency key not found in incoming request headers"});
        }

        if(inMemDb[idempotencyKey]) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({message: "Cannot retry on successful payment"});
        }

        const response = await BookingService.makePayment({
          bookingId: req.body.bookingId,
          userId: req.body.userId,
          totalCost: req.body.totalCost,
        });
        inMemDb[idempotencyKey] = idempotencyKey;
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


module.exports = {
    createBooking,
    makePayment,
}