import {NextFunction, Request, Response} from "express";
import {getAuthenticatedUser} from "../services/auth.service";
import {JwtPayload, verify} from "jsonwebtoken";
import {getUserById} from "../services/user.service";

export const adminAuthMiddleware =  async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jwt = req.cookies.jwt;

        let payload: JwtPayload

        payload = verify(jwt, process.env.ADMIN_USER_JWT_SECRET_KEY) as JwtPayload

        if (!payload) {
            return res.status(401).send({
                status: 401,
                data: {
                    message: 'unauthenticated'
                }
            })
        }

        const user = await getUserById( payload.id )

        // implement scopes here
        // check scope (Note: find the better way to do this)

        if (req.path.indexOf('api/admin') && payload.scope !== 'admin') {
            return res.status(401).send({
                status: 401,
                data: {
                    message: 'unauthorized'
                }
            })
        }

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