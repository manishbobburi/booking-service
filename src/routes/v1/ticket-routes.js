const express = require("express");
const router = express.Router();

const { TicketController } = require("../../controllers");
const { TicketMiddlewares } = require("../../middlewares");

router.post("/",
    TicketMiddlewares.validateTicketdata,
    TicketController.createTicket
);

router.patch("/",
    TicketController.cancelTicket
);

module.exports = router;