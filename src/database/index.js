// eslint-disable-next-line no-undef
const dbType = process.env.DATABASE;
let currentDb, currentPasswordGenerator;
if (dbType === "MONGODB") {
    const { db, passwordGenerator } = require("./mongodb/index");
    currentPasswordGenerator = passwordGenerator;
    currentDb = db;
} else {
    const { pool } = require("./postgreSql/index");
    currentDb = pool;
}

module.exports = {
    db: currentDb,
    passwordGenerator: currentPasswordGenerator
};
