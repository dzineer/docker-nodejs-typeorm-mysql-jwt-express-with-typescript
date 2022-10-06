
import { format, createLogger, transports } from 'winston'

const { timestamp, combine, printf, colorize, errors, json, simple, prettyPrint } = format;

function customLogger(logname, level = 'info', fileType = 'log', formatterCallback = null) {

    const logFormat = printf(({level, message, timestamp, stack}) => {
        return `${timestamp} ${level} : ${stack || message}`
    });

    let format = combine(
        timestamp(),
        errors({stack: true}),
        simple()
    )

    if (formatterCallback) {

        let format = formatterCallback(
            { timestamp, combine, printf, colorize, errors, formatters: { json, simple, prettyPrint } }
        );

        return createLogger({
            level,
            format,
            defaultMeta: { service: 'user-service' },
            transports: [
                new transports.File({
                    dirname: 'logs',
                    filename: logname + '.' + fileType,
                    level,
                })
            ],
        });
    } else {
        return createLogger({
            level: 'debug',
            format,
            defaultMeta: { service: 'user-service' },
            transports: [
                new transports.File({
                    dirname: 'logs',
                    filename: logname + '.' + fileType,
                    level,
                    format
                })
            ],
        });
    }

}

export default customLogger;
