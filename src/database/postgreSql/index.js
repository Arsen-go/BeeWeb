/* eslint-disable no-undef */
const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

let pool;
(async function connect() {
    try {
        pool = new Pool({
            user: "postgres",
            host: process.env.PG_HOST,
            database: process.env.PG_DATABASE,
            password: "ars022074",
            port: process.env.PG_PORT,
        });

        await pool.connect();
        console.log("Connected to Postgres Database");
        return { pool };
    } catch (error) {
        console.log(error);
    }
})();

module.exports = { pool };
