const { CrudRepository } = require("./crud-repository");
const { Payment } = require("../models");

class PaymentRepository extends CrudRepository {
    constructor() {
        super(Payment);
    }
}

module.exports = PaymentRepository;