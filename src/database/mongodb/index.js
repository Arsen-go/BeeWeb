/* eslint-disable no-undef */
require("dotenv").config();
const db = require("mongoose");
const { logger } = require("../../logger");

const connectionPath = `${process.env.DB_ADDRESS}`;

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
    logger.info(`Node process ends: DB connection is closed.`)
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
