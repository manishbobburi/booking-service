const { Op } = require("sequelize");
const { StatusCodes } = require("http-status-codes");

const { Ticket } = require("../models");
const CrudRepository = require("./crud-repository");
const { Errors: { AppError } } = require("../utils");

class TicketRepository extends CrudRepository {
    constructor() {
        super(Ticket);
    }

    async cancelTicket(ticketNumber, payload) {
        const response = await Ticket.update(payload, {
            where: {
                ticketNumber: ticketNumber,
            },
        });
        
        if(!response[0]) {
            throw new AppError("ticket not found", StatusCodes.NOT_FOUND);
        }

        return response;
    }
}

module.exports = TicketRepository;