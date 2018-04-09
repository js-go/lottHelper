const path = require('path')
const winston = require('winston')

const errorLogFile = path.join(__dirname, 'logs', 'error.log')
const combinedLogFile = path.join(__dirname, 'logs', 'combined.log')

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.combine(
      winston.format.timestamp(),
      winston.format.splat(),
      winston.format.json(),
      winston.format.printf(
        info => `${info.timestamp} ${info.level}: ${info.message}`
      )
    )
  ),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: errorLogFile, level: 'error' }),
    new winston.transports.File({ filename: combinedLogFile })
  ]
})

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  logger.add(
    new winston.transports.Console(
      winston.format.combine(
        winston.format.timestamp(),
        winston.format.splat(),
        winston.format.json(),
        winston.format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`
        )
      )
    )
  )
}

module.exports = logger
