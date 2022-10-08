import {AppDataSource} from "../utils/data-source";
import { faker } from '@faker-js/faker';
import {randomInt} from "crypto";
import {Order} from "../entities/order.entity";
import {OrderItem} from "../entities/order-item.entity";
import {createUser} from "../services/user.service";
import {createLink} from "../services/link.service";
import {Product} from "../entities/product.entity";

AppDataSource.initialize().then(async () => {
    // const repository = get
    const orderRepository = AppDataSource.getRepository(Order)
    const orderItemRepository = AppDataSource.getRepository(OrderItem)
    const productRepository = AppDataSource.getRepository(Product);

    for(let i=0; i < 30; i++) {

        const first_name = faker.name.firstName();
        const last_name = faker.name.firstName();
        const email = `${first_name}.${last_name}@nowhere.com`

        const user = await createUser({
            id: i+1,
            first_name,
            last_name,
            email,
            password: 'password',
            is_ambassador: true
        })

        // give four products

        for(let j=0; j < randomInt(1, 2); j++)
        {
            const product = await productRepository.save(
                productRepository.create({
                    title: faker.commerce.product(),
                    description: faker.commerce.productDescription(),
                    image: faker.image.lorempicsum.imageUrl(200, 100),
                    price: parseInt(faker.commerce.price()),
                })
            )

            const link = await createLink(
                user,
                [product]
            )

            for(let k=0; k <= randomInt(1, 2); k++) {

                const order = await orderRepository.save({
                    user_id: user.id,
                    code: link.code,
                    ambassador_email: faker.internet.email(),
                    first_name: faker.name.firstName(),
                    last_name: faker.name.lastName(),
                    email: faker.internet.email(),
                    complete: true
                })

                for(let l=0; l < randomInt(1, 2); l++) {
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
        }
    }



    process.exit();

}).catch((error) => console.log(error));