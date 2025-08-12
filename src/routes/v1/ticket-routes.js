const express = require("express");
const router = express.Router();

const { TicketController } = require("../../controllers");
const { TicketMiddlewares } = require("../../middlewares");

router.post("/",
    TicketMiddlewares.validateTicketdata,
    TicketController.createTicket
);

module.exports = router;