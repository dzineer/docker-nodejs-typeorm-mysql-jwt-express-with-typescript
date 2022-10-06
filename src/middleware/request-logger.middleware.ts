import requestsLogger from "../logger/requests-logger";
import {enable_middleware_watch} from "../index";

const requestLogger = (req, res, next) => {

    if (!enable_middleware_watch) {
        next();
    }

    console.log(`we are in our middleware`)

    const { rawHeaders, headers, httpVersion, method, socket, url } = req;
    const { remoteAddress, remoteFamily } = socket;

    let payload = {};

    if (method === 'GET') {
        payload = { query: req.query, params: req.params }
    } else if (method === 'POST' || method === 'PUT') {
        payload = { body: req.body, params: req.params }
    }

    const data = JSON.stringify({
        //    headers,
        //    rawHeaders,
        //    httpVersion,
        request: method + " : " + url,
        //     remoteAddress,
        //     remoteFamily,
        payload,
        timestamp: new Date().getTime(),
    })

    const out = "[ Route: " + method + " : " + url + " payload: " + JSON.stringify(payload) + " ]"

    console.log("\n\nRoute");
    requestsLogger.info(out);
    //routesLogger.info(data);
    console.log(data);
    console.log("\n\n/Route");

    next();
}

export default requestLogger;
