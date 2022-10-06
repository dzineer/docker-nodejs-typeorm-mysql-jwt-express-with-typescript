import {Request, Response} from "express";
import {getOrders, getUserOrders} from "../../services/order.service";
import {Order} from "../../entities/order.entity";


export const index =  async (req: Request, res: Response) => {
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

export const OrderController = {
    index,
}
