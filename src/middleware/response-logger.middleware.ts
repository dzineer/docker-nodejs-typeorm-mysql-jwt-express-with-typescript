import responsesLogger from "../logger/responses-logger";
import {enable_middleware_watch} from "../index";

const responseLogger = (req, res, next) => {

    if (!enable_middleware_watch) {
        next();
    }

    const oldWrite = res.write,
        oldEnd = res.end;

    const chunks = [];

    res.write = function (chunk) {
        chunks.push(chunk);

        return oldWrite.apply(res, arguments);
    };

    res.end = function (chunk) {
        if (chunk)
            chunks.push(chunk);

        const body = Buffer.concat(chunks).toString('utf8');

        responsesLogger.info(JSON.stringify({route: req.path, response: body}));
        console.log(req.path, body);

        oldEnd.apply(res, arguments);
    };

    next();
}

export default responseLogger;