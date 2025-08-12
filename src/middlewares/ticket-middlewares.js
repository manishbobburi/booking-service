const { StatusCodes} = require("http-status-codes");

const { Common: { ErrorResponse }, Errors: { AppError }} = require("../utils");

function validateTicketdata(req, res, next) {
    const errors = [];

    if(!req.body.passengerId) {
        errors.push("Passenger Id not found in the incoming request.");
    }

    if(!req.body.seatId) {
        errors.push("Seat Id not found in the incoming request.");
    }

    if(errors.length > 0) {
        ErrorResponse.message = "Some thing went wrong while generating ticket.";
        ErrorResponse.error = new AppError(errors);
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }

    next();
}

module.exports = {
    validateTicketdata,
}