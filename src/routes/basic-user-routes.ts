import {Router} from "express";
import {updateInfo, UserAuthController} from "../controllers/user/user-auth.controller";
import {userAuthMiddleware} from "../middleware/user-auth.middleware";

export const basicUserRoutes = (router: Router) => {
    router.post('/api/user/register', UserAuthController.registerUser )
    router.post('/api/user/login', UserAuthController.login)
    router.post('/api/user/logout', userAuthMiddleware, UserAuthController.logout)
    router.get('/api/user', userAuthMiddleware, UserAuthController.authenticatedUser)
    router.put('/api/user/info', userAuthMiddleware, UserAuthController.updateInfo)
}