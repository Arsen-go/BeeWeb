/* eslint-disable no-undef */
const MongoDbRepository = require("./dbRepository");
const PgRepository = require("./pgRepository");

const selectedDatabase = process.env.DATABASE;

if (selectedDatabase === "MONGODB") {
    module.exports = MongoDbRepository;
} else {
    module.exports = PgRepository;
}

