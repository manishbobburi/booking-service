const { StatusCodes } = require("http-status-codes");

const { PassengerService } = require("../services");
const { Common: { SuccessResponse, ErrorResponse } } = require("../utils");

async function createPassenger(req, res) {
    try {
        const passenger = await PassengerService.createPassenger({
            bookingId: req.body.bookingId,
            name: req.body.name,
            age: req.body.age,
            idType: req.body.idType,
            idNumber: req.body.idNumber,
        });
        
        SuccessResponse.data = passenger;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);

    } catch (error) {
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

module.exports = {
    createPassenger,
}