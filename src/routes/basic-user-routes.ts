import {Router} from "express";
import { UserAuthController } from "../controllers/user/user-auth.controller";
import {userAuthhMiddleware} from "../middleware/user-auth.middleware";

export const basicUserRoutes = (router: Router) => {
    router.post('/api/user/register', UserAuthController.registerUser )
    router.post('/api/user/login', UserAuthController.login)
    router.post('/api/user/logout', userAuthhMiddleware, UserAuthController.logout)
    router.get('/api/user', userAuthhMiddleware, UserAuthController.authenticatedUser)
}