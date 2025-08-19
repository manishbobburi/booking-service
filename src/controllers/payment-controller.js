const { StatusCodes } = require("http-status-codes");

const { PaymentService } = require("../services");
const { Common: { SuccessResponse, ErrorResponse } } = require("../utils");

async function createPayment(req, res) {
    try {
        const response = await PaymentService.createPayment({
            amount: req.body.amount,
            paymentMethod: req.body.paymentMethod,
        });

        SuccessResponse.data = response;
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

async function cancelPayment(req, res) {
    try {
        const response = await PaymentService.cancelPayment(req.body.paymentId);

        SuccessResponse.data = response;
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
    createPayment,
    cancelPayment,
}