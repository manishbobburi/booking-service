const express = require('express');
const router = express.Router();

const ticketRoutes = require("./ticket-routes");
const bookingRoutes = require("./booking-routes");
const passengerRoutes = require("./passenger-routes");

router.use("/bookings", bookingRoutes);
router.use("/ticket", ticketRoutes);
router.use("/passenger", passengerRoutes);

module.exports = router;