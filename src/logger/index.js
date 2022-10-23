const winston = require('winston');
require('winston-daily-rotate-file');

const logFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf(
    info => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

const transport = new (winston.transports.DailyRotateFile)({
  filename: 'logs/beeWebLogger-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '2d',
  maxFiles: '14d',
});

winston.loggers.add('beeWebLogger', {
  format: logFormat,
  transports: [
    transport,
    new winston.transports.Console({
      level: 'info',
    }),
  ],
});

const logger = winston.loggers.get('beeWebLogger');

module.exports = { logger };
