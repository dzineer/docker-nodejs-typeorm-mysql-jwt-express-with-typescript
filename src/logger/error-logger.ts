const customLogger = require("./custom-logger")

const devicePingsLogger = customLogger('error-log', 'debug', 'json', ({timestamp, combine, printf, colorize, errors, formatters}) => {
    return combine(
        colorize(),
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        errors({stack: true}),
        formatters.prettyPrint(),
        formatters.simple(),
    )
});

module.exports = devicePingsLogger
