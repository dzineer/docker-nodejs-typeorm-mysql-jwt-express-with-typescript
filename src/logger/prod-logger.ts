
const { format, createLogger, transports } = require("winston");
const { timestamp, combine, printf, colorize, errors, json } = format;

function buildProdLogger() {

    const logFormat = printf(({level, message, timestamp, stack}) => {
        return `${timestamp} ${level} : ${stack || message}`
    });

    return createLogger({
        level: 'debug',
        format: combine(
            timestamp(),
            errors({stack: true}),
            json()
        ),
        defaultMeta: { service: 'user-service' },
        transports: [
            new transports.File({
                dirname: 'logs',
                filename: 'info.log',
                level: 'info',
                format: combine(
                    timestamp(),
                    errors({stack: true}),
                    json()
                )
            })
        ],
    });
}

module.exports = buildProdLogger;
