import {Request, Response} from 'express';
import {
    createUser,
    getUserById,
    getUserWithIdPassword,
    updateUser,
    updateUserPassword
} from '../../services/user.service';
import { genUserToken, getAuthenticatedUser } from '../../services/auth.service';

import * as bcrypt from 'bcryptjs';
import {JwtPayload, verify} from "jsonwebtoken";

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export const login =  async (req: Request, res: Response) => {

    const { email, password } = req.body;
    const user = await getUserWithIdPassword(email, 0)

    if (!user) {
        return res.status(400).send({
            message: "Invalid credentials!"
        })
    }

    if (!await bcrypt.compare(password, user.password)) {
        return res.status(400).send({
            message: "Invalid credentials!"
        })
    }

    const token = genUserToken(user, "AdminUser", 'admin')

    res.cookie("jwt", token,
        {
            httpOnly: true,
            maxAge: ONE_DAY_IN_MS
        })

    return res.status(200).send({
        message: "Successfully logged in!",
    })

}

export const authenticatedUser =  async (req: Request, res: Response) => {
    return res.status(200).send(req["user"])
}

export const registerUser = async (req: Request, res: Response) => {
    const { password, password_confirm, email, ...body } = req.body;

    if (password !== password_confirm) {
        return res.status(400).send({
            message: "Password's do not match"
        })
    }

    try {
        const newUser = await createUser({
            ...body,
            email: email.toLowerCase(),
            password,
            is_ambassador: false
        })

        res.send('User created successfully!')
    }
    catch (err: any) {
        if (err.errno === 1062) {
            return res.status(400).send({
                message: 'User with that email already exist',
            })
        } else {
            return res.status(400).send({
                message: 'Error: User was not created!',
            })
        }

    }
}

export const logout =  async (req: Request, res: Response) => {
    res.cookie("jwt", "", { maxAge:0} )
    return res.status(200).send({
        message: "Successfully logged out!",
    })
}

export const updateInfo =  async (req: Request, res: Response) => {
    const userInfo = req['user'];
    await updateUser(userInfo.id, {
        ...req.body
    })
    const user = await  getUserById(userInfo.id)
    return res.status(200).send(user);
}

export const updatePassword =  async (req: Request, res: Response) => {
    const userInfo = req['user'];
    const { password, password_confirm } = req.body;

    if (password !== password_confirm) {
        return res.status(400).send({
            message: "Password's do not match"
        })
    }

    await updateUserPassword(userInfo.id, password);

    return res.status(200).send({
        message: 'Password updated.',
    })
}

export const AdminAuthController = {
    registerUser,
    authenticatedUser,
    login,
    logout,
    updateInfo,
    updatePassword
}
