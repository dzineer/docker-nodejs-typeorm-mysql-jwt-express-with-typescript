import * as express from "express"
import { Request, Response } from "express"
import config from 'config';
import { AppDataSource } from './utils/data-source'
import * as cors from 'cors';

import { adminRoutes } from "./routes/admin-user-routes";
import { basicUserRoutes } from "./routes/basic-user-routes";

import * as dotenv from 'dotenv'
import * as cookieParser from 'cookie-parser'

dotenv.config()

AppDataSource.initialize().then(async () => {
    const app = express()

    app.use(express.json())

    // let’s you use the cookieParser in your application
    app.use(cookieParser());

    app.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true,
        })
    );

    adminRoutes(app)
    basicUserRoutes(app)

    app.listen(8000, () => {
        console.log(`listing to port:8000`)
    })

}).catch((error) => console.log(error));

