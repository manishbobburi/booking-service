const { StatusCodes} = require("http-status-codes");

const { Common: { ErrorResponse }, Errors: { AppError }} = require("../utils");

function validatePassengerdata(req, res, next) {
    const errors = [];

    if(!req.body.bookingId) {
        errors.push("Booking id not found in the incoming request.");
    }

    if(!req.body.name) {
        errors.push("Name not found in the incoming request.");
    }

    if(!req.body.age) {
        errors.push("Age not found in the incoming request.");
    }

    if(!req.body.idType) {
        errors.push("Id type not found in the incoming request.");
    }

    if(!req.body.idNumber) {
        errors.push("Id number not found in the incoming request.");
    }

    if(errors.length > 0) {
        ErrorResponse.message = "Some thing went wrong while creating passenger.";
        ErrorResponse.error = new AppError(errors);
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }

    next();
}

module.exports = {
    validatePassengerdata,
}