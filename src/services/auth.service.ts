import {JwtHeader, JwtPayload, sign, verify} from "jsonwebtoken";
import {User} from "../entities/user.entity";
import {getUserById} from "./user.service";

export const genUserToken = (user: User, userType: string) => {
    if (userType === 'BasicUser') {
        return sign({
            id: user.id
        }, process.env.BASIC_USER_JWT_SECRET_KEY)
    }
    else if (userType === 'AdminUser') {
        return sign({
            id: user.id
        }, process.env.ADMIN_USER_JWT_SECRET_KEY)
    }

    return null;
}

export const getAuthenticatedUser = async (jwt: string, userType: string) => {
    let payload: JwtPayload

    if (userType === 'BasicUser') {
        payload = verify(jwt, process.env.BASIC_USER_JWT_SECRET_KEY) as JwtPayload
    }
    else if (userType === 'AdminUser') {
        payload = verify(jwt, process.env.ADMIN_USER_JWT_SECRET_KEY) as JwtPayload
    }

    if (!payload) {
        return false
    }

    const user = await getUserById( payload.id )

    return user;
}
