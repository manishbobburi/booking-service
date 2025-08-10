const CrudRepository = require("./crud-repository");
const { Seats } = require("../models");

class SeatsRepository extends CrudRepository {
    constructor() {
        super(Seats);
    }
}

module.exports = SeatsRepository;