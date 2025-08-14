const express = require("express");
const router = express.Router();

const { PassengerController } = require("../../controllers");
const { PassengerMiddlewares } = require("../../middlewares");

router.post("/",
    PassengerMiddlewares.validatePassengerdata,
    PassengerController.createPassenger
);

module.exports = router;