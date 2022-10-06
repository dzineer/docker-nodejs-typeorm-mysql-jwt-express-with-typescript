import {AppDataSource} from '../utils/data-source';
import {FindOptionsWhere} from "typeorm";
import {Order} from "../entities/order.entity";
import {Link} from "../entities/link.entity";
import {getProductById} from "./product.service";
import {Product} from "../entities/product.entity";
import {OrderItem} from "../entities/order-item.entity";
import {orders} from "../controllers/user/user.controller";
import Stripe from 'stripe';
import {randomInt} from "crypto";
import {initStripe, StripeService} from "./stripe.service";

const orderRepository = AppDataSource.getRepository(Order);
const orderItemRepository = AppDataSource.getRepository(OrderItem);

export const getOrders = async () => {
    const options: FindOptionsWhere<any> = {
        where: {
            complete: true,

        },
        relations: ['order_items'],
    }
    return await orderRepository.find(options)
}

export const getUserOrders = async (user_id: number) => {
    const options: FindOptionsWhere<any> = {
        where: {
            user_id,
            complete: true,

        },
        relations: ['order_items'],
    }
    return await orderRepository.find(options)
}

const calculateOrderAmount = (items) => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return 1400;
};

export const createOrder = async (link: Link, products: [], customer: object) => {
    let order
    const queryRunner = AppDataSource.createQueryRunner()
    try {
        await queryRunner.connect()
        await queryRunner.startTransaction()

        order = orderRepository.create({
            user_id: link.user.id,
            ambassador_email: link.user.email,
            code: link.code,
            ...customer
        });

        order = await queryRunner.manager.save( order )

        let line_items = [];

        for(let p of products) {
            const { product_id, quantity } = p;
            console.info(`product_id: ${product_id} quantity: ${quantity}`)
            const product = await getProductById(product_id)
            console.info('product', product)
            let orderItem = await makeOrderItem(order, product, quantity );
            orderItem = await queryRunner.manager.save( orderItem )

            // price_CODE_FROM_STRIPE
            line_items.push({
                price_data: {
                    currency: 'usd',
                    unit_amount: product.price * 100,
                    product_data: {
                        name: product.title,
                    }
                },
                quantity: quantity
            });
        }

        // Note: Integrate Stripe Payment APIs
        // * As of date: 2022/01/03
        // 0. Connect to stripe
        // 1. Create a checkout source from a session
        // 2. Save source['id'] as the order's transaction_id

        // 0. Connect to stripe
        const stripe = await StripeService.init(process.env.STRIPE_SECRET)

        // 1. Create a checkout session source
        const source = await StripeService.createSource(stripe, 'payment', line_items, {
            success_url: `${process.env.CHECKOUT_URL}/success?source={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CHECKOUT_URL}/error`,
        })

        // 2. Save source['id'] as the order's transaction_id
        order.transaction_id = source['id'];
        // order.transaction_id = randomInt(2000, 8000)

        await queryRunner.manager.save((order));

        // we made it...
        await queryRunner.commitTransaction()

        return source;
    }
    catch(err) {
        console.error('error', err)
        await queryRunner.rollbackTransaction()
        return false
    }
}

export const createOrderItem = async (order: Order, product: Product, quantity: number) => {

    const orderItem = await orderItemRepository.save(
        orderItemRepository.create({
            order,
            product_title: product.title,
            price: product.price,
            quantity,
            ambassador_revenue: 0.1 * product.price * quantity,
            admin_revenue: 0.9 * product.price * quantity,
        })
    );

    console.info('orderItem', orderItem)

    return orderItem;

}

export const makeOrderItem = async (order: Order, product: Product, quantity: number) => {

    let orderItem = orderItemRepository.create({
        order,
        product_title: product.title,
        price: product.price,
        quantity,
        ambassador_revenue: 0.1 * product.price * quantity,
        admin_revenue: 0.9 * product.price * quantity,
    })

    return orderItem;

}


export const getOrderByTrx = async (source_id: string) => {
    const options: FindOptionsWhere<any> = {
        where: {
            transaction_id: source_id,
        },
        relations: ['order_items'],
    }
    return await orderRepository.findOne(options)
}


export const completeOrder = async (order_id: number) => {
    await orderRepository.update(order_id, {
        complete: true
    })
}



