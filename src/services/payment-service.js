const { StatusCodes } = require("http-status-codes");

const { PaymentRepository } = require("../repositories");
const { Errors: { AppError } } = require("../utils");

const paymentRepository = new PaymentRepository();

async function createPayment(data) {
    try {
        data.payment_date = new Date();
        const response = await paymentRepository.create(data);
        return response;
    } catch (error) {
        throw new AppError("Failed to make payment", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function cancelPayment(paymentId) {
    try {
        const response = await paymentRepository.destroy(paymentId);
        return response;
    } catch (error) {
        throw new AppError("Failed to cancel payment", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createPayment,
    cancelPayment,
}