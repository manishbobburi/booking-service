const express = require('express');
const router = express.Router();

const { BookingController } = require('../../controllers');


router.post("/", 
    BookingController.createBooking
);

router.post("/payments",
    BookingController.makePayment
);

router.get("/mybookings",
    BookingController.getBookingsByUserId
)

module.exports = router;