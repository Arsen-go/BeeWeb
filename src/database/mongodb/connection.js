/* eslint-disable no-undef */
require("dotenv").config();
const db = require("mongoose");
const { logger } = require("../../logger");


let connectionPath = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
// If you want to test api's with unit tests or use another one
if(process.env.DB_IS_TEST) {
  // DB_HOST DB_PORT and DB_NAME must chang
  connectionPath = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
}


db.connection.on("connected", () => {
  logger.info("DB is connected.");
});

db.connection.on("error", (error) => {
  logger.error(`Connection to DB went wrong: ${error}`);
});

db.connection.on("disconnected", () => {
  logger.warn(`DB disconnected.`);
});

const gracefulExit = () => {
  db.connection.close(() => {
    logger.info(`Node process ends: DB connection is closed.`);
    process.exit(0);
  });
};

process.on("SIGINT", gracefulExit).on("SIGTERM", gracefulExit);

db.connect(
  connectionPath,
  { useNewUrlParser: true },
  () => {
    console.log("connected to database");
  }
);

module.exports = { db };
