import {Request, Response} from "express";

export const routesMiddleware = (app) => {

    return  (req: Request, res: Response) => {
        if (req.body['token'] === undefined || req.body['token'] !== process.env.WEB_SECURITY_KEY) {
            res.status(400).send({message: "unauthorized"});
        }

        let route, routes = [];

        let stacks = app._router.stack;

        stacks.forEach((stack) =>  {
            if (stack.name === "bound dispatch" && stack.route.path.length) {
                routes.push({"route": stack.route.path, "methods": stack.route.methods});
            }
        })

        res.send(routes);
    }

}
