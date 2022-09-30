import {Router} from "express";
import { AdminAuthController } from "../controllers/admin/admin-auth.controller";

export const adminRoutes = (router: Router) => {
    router.post('/api/admin/register', AdminAuthController.registerUser)
    router.post('/api/admin/login', AdminAuthController.login)
    router.get('/api/admin/authenticated-user', AdminAuthController.authenticatedUser)
}