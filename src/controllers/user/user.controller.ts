import {Request, Response} from "express";
import {getUsersByType} from "../../services/user.service";
import {createLink, getUserLinks} from "../../services/link.service";
import {Order} from "../../entities/order.entity";
import {getUserOrders} from "../../services/order.service";
import {redisClient} from "../../index";

export const orders =  async (req: Request, res: Response) => {
    const user = req["user"];
    const orders = await getUserOrders(user.id);

    const revenue = orders.reduce( (sum:number, order: Order) => sum + order.ambassador_revenue, 0);

    return res.status(200).send({
        status: 200,
        data: {
            orders,
            revenue
        }
    })
}

export const ambassadors =  async (req: Request, res: Response) => {
    const users = await getUsersByType(1)
    console.info(`ambassadors: `, users)
    return res.status(200).send(users)
}

export const userStats =  async (req: Request, res: Response) => {
    const user = req['user'];

    let links = await getUserLinks(user.id)

    let stats = links.map(link => {
        const orders = link.orders.filter(o => o.complete)
        return {
            code: link.code,
            count: orders.length,
            revenue: orders.reduce((sum:number, o: Order) => sum + o.ambassador_revenue, 0)
        }
    })

    return res.status(200).send({
        status: 200,
        data: {
            stats
        }
    })
}

export const rankings =  async (req: Request, res: Response) => {
    let result: string[] = await redisClient.sendCommand(['ZREVRANGEBYSCORE', 'rankings', '+inf', '-inf', 'WITHSCORES']);
    let name;

    // return res.status(200).send({
    //     status: 200,
    //     data: {
    //         result
    //     }
    // })

    // using an array, build up an object to look like
    // {
    //   [name]: ranking,
    //   [name]: ranking,
    //   [name]: ranking,
    //   ...
    // }
    //

    let stats = result.reduce((o, r ) => {
        if (isNaN(parseInt(r))) {
            name = r;
            return o;
        } else {
            return {
                ...o,
     //           [name]: parseInt(r)
                [name]: parseInt(r)
            }
        }
    }, {})
    return res.status(200).send({
        status: 200,
        data: {
            stats
        }
    })
}

export const UserController = {
    ambassadors,
    userStats,
    rankings,
    orders
}
