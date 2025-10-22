const SEAT_TYPE = {
    BUSINESS: "business",
    ECONOMY: "economy",
    PREMIUM_ECONOMY: "premium-economy",
    FIRST_CLASS: "first-class",
}

const BOOKING_STATUS = {
    BOOKED: "booked",
    PENDING: "pending",
    INITIATED: "initiated",
    CANCELLED: "cancelled",
    FAILED: "failed",
}

const ID_TYPE = {
    AADHAR: "aadhar",
    PASSPORT: "passport",
    DRIVERS_LICENSE: "drivers license",
}

const TICKET_STATUS = {
    ACTIVE: "active",
    CANCELLED: "cancelled",
    USED: "used",
    VOIDED: "voided",
}

const PAYMENT_METHODS = {
    CARD: "card",
    UPI: "upi",
    NET_BANKING: "netbanking",
}

const PAYMENT_STATUS = {
    SUCCESS: "success",
    FAILED: "failed",
    PROCESSING: "processing",
}

module.exports = {
    SEAT_TYPE,
    BOOKING_STATUS,
    ID_TYPE,
    TICKET_STATUS,
    PAYMENT_METHODS,
    PAYMENT_STATUS,
}