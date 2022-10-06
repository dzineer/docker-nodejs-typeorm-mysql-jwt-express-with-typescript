const customLogger = require("./custom-logger")

const devicePingsLogger = customLogger('device-pings', 'debug', 'json', ({timestamp, combine, printf, colorize, errors, formatters}) => {

    const logFormat = printf(({level, message, timestamp, stack}) => {
        return `${timestamp} ${level} : ${stack || message}`
    });

    return combine(
        timestamp(),
        printf(({level, message, timestamp, stack}) => {
            return `${timestamp} ${level} : ${stack || message}`
        })
    )
});

module.exports = devicePingsLogger
