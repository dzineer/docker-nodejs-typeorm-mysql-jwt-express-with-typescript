import {Request, Response} from "express";
import {getUsersByType} from "../../services/user.service";

export const ambassadors =  async (req: Request, res: Response) => {
    const users = await getUsersByType(1)
    console.info(`ambassadors: `, users)
    return res.status(200).send({
        status: 200,
        data: {
            users,
        }
    })
}

export const UserController = {
    ambassadors,
}
