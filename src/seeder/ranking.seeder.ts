import {AppDataSource} from "../utils/data-source";
import { faker } from '@faker-js/faker';
import {randomInt} from "crypto";
import {Order} from "../entities/order.entity";
import {OrderItem} from "../entities/order-item.entity";
import {createClient} from "redis";
import {getUsersByType} from "../services/user.service";
import {getUserOrders} from "../services/order.service";

AppDataSource.initialize().then(async () => {

    const redisClient = createClient({
        url: 'redis://redis:6379'
    });

    await redisClient.connect()

    let users = await getUsersByType(1)

    for(let i=0; i < users.length; i++) {
        const orders = await getUserOrders(users[i].id)

        const revenue = orders.reduce((sum:number, o: Order) => sum + o.ambassador_revenue, 0)
        await redisClient.zAdd('rankings', {
            value: users[i].name,
            score: revenue
        })
    }

    process.exit();

}).catch((error) => console.log(error));