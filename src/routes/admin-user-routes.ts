import {Router} from "express";
import { AdminAuthController } from "../controllers/admin/admin-auth.controller";
import {adminAuthMiddleware} from "../middleware/admin-auth.middleware";
import {UserController} from "../controllers/user/user.controller";

export const adminRoutes = (router: Router) => {
    router.post('/api/admin/register', AdminAuthController.registerUser)
    router.post('/api/admin/login', AdminAuthController.login)
    router.post('/api/admin/logout', adminAuthMiddleware, AdminAuthController.logout)
    router.get('/api/admin', adminAuthMiddleware, AdminAuthController.authenticatedUser)
    router.put('/api/admin/info', adminAuthMiddleware, AdminAuthController.updateInfo)
    router.put('/api/admin/password', adminAuthMiddleware, AdminAuthController.updatePassword)
    router.get('/api/admin/ambassadors', adminAuthMiddleware, UserController.ambassadors)
}