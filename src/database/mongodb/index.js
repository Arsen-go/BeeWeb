const { db } = require("./connection");
const passwordGenerator = require("./hash");

module.exports = { db, passwordGenerator };