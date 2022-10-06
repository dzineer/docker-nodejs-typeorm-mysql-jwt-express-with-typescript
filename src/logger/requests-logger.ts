import customLogger from './custom-logger'

const requestsLogger = customLogger('requests', 'debug', 'json', ({timestamp, combine, printf, colorize, errors, formatters}) => {

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

export default requestsLogger;
