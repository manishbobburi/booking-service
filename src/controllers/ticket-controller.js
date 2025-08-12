const { StatusCodes } = require("http-status-codes");

const { TicketService } = require("../services");
const { Common: { SuccessResponse, ErrorResponse } } = require("../utils");

async function createTicket(req, res) {
    try {
        const ticket = await TicketService.createTicket({
            seatId: +req.body.seatId,
            passengerId: +req.body.passengerId,
        });

        SuccessResponse.data = ticket;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);

    } catch(error) {
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

module.exports = {
    createTicket,
}