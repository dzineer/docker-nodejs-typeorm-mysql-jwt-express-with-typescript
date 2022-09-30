import {Router} from "express";
import { AdminAuthController } from "../controllers/admin/admin-auth.controller";
import {adminAuthMiddleware} from "../middleware/admin-auth.middleware";
import {userAuthMiddleware} from "../middleware/user-auth.middleware";

export const adminRoutes = (router: Router) => {
    router.post('/api/admin/register', AdminAuthController.registerUser)
    router.post('/api/admin/login', AdminAuthController.login)
    router.post('/api/user/logout', adminAuthMiddleware, AdminAuthController.logout)
    router.get('/api/admin', adminAuthMiddleware, AdminAuthController.authenticatedUser)
    router.put('/api/user/info', userAuthMiddleware, AdminAuthController.updateInfo)
    router.put('/api/password', userAuthMiddleware, AdminAuthController.updatePassword)
}