import {Request, Response} from 'express';
import {createUser, getUserWithIdPassword} from '../../services/user.service';
import { genUserToken, getAuthenticatedUser } from '../../services/auth.service';

import * as bcrypt from 'bcryptjs';
import {JwtPayload, verify} from "jsonwebtoken";

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export const login =  async (req: Request, res: Response) => {

    const { email, password } = req.body;
    const user = await getUserWithIdPassword(email, 1)

    if (!user) {
        return res.status(400).send({
            status: 400,
            data: {
                message: "Invalid credentials!"
            }
        })
    }

    if (!await bcrypt.compare(password, user.password)) {
        return res.status(400).send({
            status: 400,
            data: {
                message: "Invalid credentials!"
            }
        })
    }

    const token = genUserToken(user, "BasicUser")

    res.cookie("jwt", token,
        {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS
    })

    return res.status(400).send({
        status: 200,
        data: {
            message: "Successfully logged in!",
        }
    })

}

export const authenticatedUser =  async (req: Request, res: Response) => {
    try {
        const jwt = req.cookies.jwt;
        const user = await getAuthenticatedUser(jwt, 'BasicUser')

        return res.status(400).send({
            status: 200,
            data: {
                user
            }
        })
    }
    catch (err) {
        return res.status(401).send({
            status: 401,
            data: {
                message: 'unauthenticated'
            }
        })
    }

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
            password: await bcrypt.hash(password, 10),
            is_ambassador: true
        })

        res.send('User created successfully!')
    }
    catch (err: any) {
        if (err.errno === 1062) {
            return res.status(400).send({
                data: {
                    message: 'User with that email already exist',
                },
                status: 400
            })
        } else {
            return res.status(400).send({
                data: {
                    message: 'Error: User was not created!',
                },
                status: 400
            })
        }

    }
}

export const logout =  async (req: Request, res: Response) => {
    res.cookie("jwt", "", { maxAge:0} )
    return res.status(400).send({
        status: 200,
        data: {
            message: "Successfully logged out!",
        }
    })
}

export const UserAuthController = {
    registerUser,
    authenticatedUser,
    login,
    logout
}
