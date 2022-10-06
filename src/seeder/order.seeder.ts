import {AppDataSource} from "../utils/data-source";
import { faker } from '@faker-js/faker';
import {randomInt} from "crypto";
import {Order} from "../entities/order.entity";
import {OrderItem} from "../entities/order-item.entity";

AppDataSource.initialize().then(async () => {
   // const repository = get
    const orderRepository = AppDataSource.getRepository(Order)
    const orderItemRepository = AppDataSource.getRepository(OrderItem)

    for(let i=0; i < 30; i++) {

        const order = await orderRepository.save({
            user_id: randomInt(2, 31),
            code: faker.random.alphaNumeric(6),
            ambassador_email: faker.internet.email(),
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            email: faker.internet.email(),
            complete: true
        })

        for(let j=0; j < randomInt(1, 5); j++) {
            const orderItem = await  orderItemRepository.save({
                order,
                product_title: faker.commerce.productDescription(),
                price: randomInt(10, 100),
                quantity: randomInt(1, 5),
                admin_revenue: randomInt(10, 100),
                ambassador_revenue: randomInt(10, 100),
            })
        }

    }

    process.exit();

}).catch((error) => console.log(error));