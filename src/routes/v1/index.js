const express = require('express');
const router = express.Router();

const ticketRoutes = require("./ticket-routes");
const bookingRoutes = require("./booking-routes");

router.use("/bookings", bookingRoutes);
router.use("/ticket", ticketRoutes);

module.exports = router;