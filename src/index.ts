import * as express from "express"
import { Request, Response } from "express"
import config from 'config';
import { AppDataSource } from './utils/data-source'
import * as cors from 'cors';

import { adminRoutes } from "./routes/admin-user-routes";
import { basicUserRoutes } from "./routes/basic-user-routes";

import * as dotenv from 'dotenv'
import * as cookieParser from 'cookie-parser'

import responsesLogger from "./logger/responses-logger";
import requestsLogger from "./logger/requests-logger";

import responseLogger from "./middleware/response-logger.middleware";
import requestLogger from "./middleware/request-logger.middleware";
import {routesMiddleware} from "./middleware/routes.middleware";
import {createClient} from 'redis';


dotenv.config()
// redis://redis:637
// redis:// {redis:hostname}:{port}
export const redisClient = createClient({
    url: 'redis://redis:6379'
});

export const debug = process.env.DEBUG || false;
export const enable_logs = process.env.LOGS || false;
export const enable_middleware_watch = process.env.MIDDLEWARE_WATCH || false;

AppDataSource.initialize().then(async () => {
    await redisClient.connect();

    const app = express()

    app.use(express.json())
    // let’s you use the cookieParser in your application
    app.use(cookieParser());
    app.use(
        cors({
        //    origin: "http://localhost:8000",
            origin: "http://localhost:8080",
            credentials: true,
        })
    );

    if (enable_logs) {
        app.use(requestLogger, responseLogger);
    }

    app.use(function (req, res, next) {
        // send header for CORS
        res.header("Access-Control-Allow-Origin", "http://localhost:8080");
        next()
    });

    // routes
    adminRoutes(app)
    basicUserRoutes(app)

    app.post('/api/routes', routesMiddleware(app));

    app.listen(8000, () => {
        console.log(`listing to port:8000`)
    })

}).catch((error) => console.log(error));

