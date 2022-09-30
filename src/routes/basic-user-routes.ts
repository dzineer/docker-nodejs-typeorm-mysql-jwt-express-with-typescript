import {Router} from "express";
import { UserAuthController } from "../controllers/user/user-auth.controller";

export const basicUserRoutes = (router: Router) => {
    router.post('/api/user/register', UserAuthController.registerUser )
    router.post('/api/user/login', UserAuthController.login)
    router.post('/api/user/logout', UserAuthController.logout)
    router.get('/api/user/authenticated-user', UserAuthController.authenticatedUser)
}