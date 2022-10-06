import {Router} from "express";
import {UserAuthController} from "../controllers/user/user-auth.controller";
import {userAuthMiddleware} from "../middleware/user-auth.middleware";
import {OrderController} from "../controllers/order.controller";
import {ProductFrontendController} from "../controllers/product-frontend.controller";
import {ProductBackendController} from "../controllers/product-backend.controller";
import {LinkController} from "../controllers/link.controller";
import {orders, UserController} from "../controllers/user/user.controller";

export const basicUserRoutes = (router: Router) => {
    router.post('/api/user/register', UserAuthController.registerUser )
    router.post('/api/user/login', UserAuthController.login)
    router.post('/api/user/logout', userAuthMiddleware, UserAuthController.logout)
    router.get('/api/user', userAuthMiddleware, UserAuthController.authenticatedUser)
    router.put('/api/user/info', userAuthMiddleware, UserAuthController.updateInfo)
    router.put('/api/user/password', userAuthMiddleware, UserAuthController.updatePassword)
    router.put('/api/user/orders', userAuthMiddleware, UserController.orders)

    router.get('/api/user/products/frontend', ProductFrontendController.index)
    router.get('/api/user/products/backend', ProductBackendController.index)

    router.post('/api/user/links', userAuthMiddleware, LinkController.store)
    router.get('/api/checkout/links/:code', LinkController.show)
    router.post('/api/checkout/orders', OrderController.store)
    router.post('/api/checkout/orders/confirm', OrderController.confirm)

    router.get('/api/user/stats', userAuthMiddleware, UserController.userStats)
    router.get('/api/user/rankings', userAuthMiddleware, UserController.rankings)
}