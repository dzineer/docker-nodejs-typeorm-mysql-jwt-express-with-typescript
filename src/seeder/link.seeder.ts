import {AppDataSource} from "../utils/data-source";
import {createLink} from "../services/link.service";
import { faker } from '@faker-js/faker';
import {createProduct} from "../services/product.service";
import {createUser} from "../services/user.service";
import {Product} from "../entities/product.entity";
import {randomInt} from "crypto";

const productRepository = AppDataSource.getRepository(Product);

AppDataSource.initialize().then(async () => {
   // const repository = get
    for(let i=0; i < 30; i++) {

        const first_name = faker.name.firstName();
        const last_name = faker.name.firstName();
        const email = `${first_name}.${last_name}@nowhere.com`

        const user =  await createUser({
            first_name,
            last_name,
            email,
            password: 'password',
            is_ambassador: true
        })

        for(let j=0; j < randomInt(1, 4); j++)
        {
            const product = await productRepository.save(
                productRepository.create({
                    title: faker.commerce.product(),
                    description: faker.commerce.productDescription(),
                    image: faker.image.lorempicsum.imageUrl(200, 100),
                    price: parseInt(faker.commerce.price()),
                })
            )

            await createLink(
                user,
                [product]
            )
        }

    }

    process.exit();

}).catch((error) => console.log(error));