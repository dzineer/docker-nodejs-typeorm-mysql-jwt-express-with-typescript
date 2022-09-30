import {NextFunction, Request, Response} from "express";
import {getAuthenticatedUser} from "../services/auth.service";

export const userAuthhMiddleware =  async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jwt = req.cookies.jwt;
        const user = await getAuthenticatedUser(jwt, 'BasicUser')
        req["user"] = user;
        next()
    }
    catch (err) {
        return res.status(401).send({
            status: 401,
            data: {
                message: 'unauthenticated'
            }
        })
    }

}