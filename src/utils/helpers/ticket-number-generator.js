const crypto = require("crypto");

function generateTicketNumber() {
    /* 
        format:- FL-YYYYMMDD-XXXXXX
    */
    const date = new Date().toISOString().slice(0,10).replaceAll('-', '');
    const unqString = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `FL-${date}-${unqString}`;
}

module.exports = generateTicketNumber;