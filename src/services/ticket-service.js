const { StatusCodes } = require("http-status-codes");

const { AppError } = require("../utils/errors");
const { TicketRepository } = require("../repositories");
const { Common: { Enums: { TICKET_STATUS: { CANCELLED } } } , Helpers: { generateTicketNumber } } = require("../utils");

const ticketRepository = new TicketRepository();

async function createTicket(data) {
    try {
        data.ticketNumber = generateTicketNumber();
        const ticket = await ticketRepository.create(data);
        return ticket;
    } catch (error) {
        throw new AppError("Failed to generate ticket.", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function cancelTicket(ticketNumber) {
    try {
        const response = await ticketRepository.cancelTicket(ticketNumber, {status: CANCELLED});
        return response;
    } catch (error) {
        console.error(error);
        throw new AppError("Failed to cancel ticket.", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createTicket,
    cancelTicket,
}
