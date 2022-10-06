const buildDevLogger = require('./dev-logger')
const buildProdLogger = require('./prod-logger')

let logger = null;

if (process.env.NODE_ENV === 'development') {
    console.log(`Loading Dev Logger`)
    logger = buildDevLogger();
} else {
    console.log(`Loading Dev Logger`)
    logger = buildProdLogger()
}

module.exports = logger;
