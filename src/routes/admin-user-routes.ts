import {Router} from "express";
import { AdminAuthController } from "../controllers/admin/admin-auth.controller";
import {adminAuthMiddleware} from "../middleware/admin-auth.middleware";
import {UserController} from "../controllers/user/user.controller";
import {ProductController} from "../controllers/product.controller";
import {LinkController} from "../controllers/link.controller";
import {OrderController} from "../controllers/order.controller";

export const adminRoutes = (router: Router) => {
    router.post('/api/admin/register', AdminAuthController.registerUser)
    router.post('/api/admin/login', AdminAuthController.login)
    router.post('/api/admin/logout', adminAuthMiddleware, AdminAuthController.logout)
    router.get('/api/admin', adminAuthMiddleware, AdminAuthController.authenticatedUser)
    router.put('/api/admin/info', adminAuthMiddleware, AdminAuthController.updateInfo)
    router.put('/api/admin/password', adminAuthMiddleware, AdminAuthController.updatePassword)
    router.get('/api/admin/ambassadors', adminAuthMiddleware, UserController.ambassadors)

    router.get('/api/admin/products', adminAuthMiddleware, ProductController.index)
    router.get('/api/admin/products/:id', adminAuthMiddleware, ProductController.show)
    router.post('/api/admin/products', adminAuthMiddleware, ProductController.store)
    router.put('/api/admin/products/:id', adminAuthMiddleware, ProductController.update)
    router.delete('/api/admin/products/:id', adminAuthMiddleware, ProductController.destroy)

    router.get('/api/admin/users/:id/links', adminAuthMiddleware, LinkController.show)
    router.get('/api/admin/orders', adminAuthMiddleware, OrderController.index)
}