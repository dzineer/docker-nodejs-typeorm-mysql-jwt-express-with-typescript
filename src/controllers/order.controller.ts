import {Request, Response} from "express";
import {completeOrder, createOrder, getOrderByTrx, getOrders} from "../services/order.service";
import {Order} from "../entities/order.entity";
import {getLinkByCode} from "../services/link.service";
import { AppDataSource } from '../utils/data-source'
import {redisClient} from "../index";
import {getUserById} from "../services/user.service";
import {MailerService} from "../services/mailer.service";

export const index =  async (req: Request, res: Response) => {
    const orders = await getOrders()

    let newOrders = orders.map( (order: Order) => ({
        id: order.id,
        name: order.name,
        email: order.email,
        total: order.total,
        created_at: order.created_at,
        order_items: order.order_items
    }));

    return res.status(200).send({
        status: 200,
        data: {
            orders: newOrders
        }
    })
}

export const show =  async (req: Request, res: Response) => {

}


export const destroy =  async (req: Request, res: Response) => {

}

export const store =  async (req: Request, res: Response) => {
    const { code } = req.body;
    const link = await getLinkByCode(code)

    if (!link) {
        return res.status(400).send({
            status: 400,
            data: {
                message: 'Invalid link!'
            }
        })
    }

    const source = await createOrder(link, req.body.products, {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        address: req.body.address,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
    })

    if (!source) {
        return res.status(400).send({
            status: 400,
            data: {
                message: 'Error occurred!'
            }
        })
    }
    // stripe redirects to url after payment is successful
    // http://localhost:5000/success?source=cs_test_b1kiHPWvUR1ZSuZbvGMRvt0EDhgWr2Mz8C3LP4wx4RUNICsewFoVyuIUeX

    return res.send(source)
}

export const update =  async (req: Request, res: Response) => {

}

export const confirm = async (req: Request, res: Response) => {
    const { source } = req.body;
    const order = await getOrderByTrx(source)

    if (!order) {
        return res.status(404).send({
            status: 404,
            data: {
                message: 'Order not found!'
            }
        })
    }

    await completeOrder(order.id)

    const user = await getUserById(order.user_id)

    await redisClient.zIncrBy('rankings', order.ambassador_revenue, user.name)

    await MailerService.sendMessage(
        'admin@nowhere.com',
        'An order has been completed',
        `Order ${order.id} with a total of $${order.total} has been completed.`
    )

    await MailerService.sendMessage(
        order.ambassador_email,
        'An order has been completed',
        `You earned $${order.ambassador_revenue} from the link ${order.code}.`
    )

    await MailerService.close()

    return res.status(200).send({
        status: 200,
        data: {
            message: 'success'
        }
    })
}

export const OrderController = {
    index,
    show,
    store,
    update,
    destroy,
    confirm
}
