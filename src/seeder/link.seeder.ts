import {AppDataSource} from "../utils/data-source";
import {createLink} from "../services/link.service";
import { faker } from '@faker-js/faker';
import {User} from "../entities/user.entity";
import {randomInt} from "crypto";
import {Product} from "../entities/product.entity";
import {createProduct} from "../services/product.service";
import {createUser} from "../services/user.service";

AppDataSource.initialize().then(async () => {
   // const repository = get
    for(let i=0; i < 30; i++) {

        const user =  await createUser({
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            email: faker.internet.email(),
            password: 'password',
            is_ambassador: true
        })

        const product  = await createProduct({
            title: faker.commerce.product(),
            description: faker.commerce.productDescription(),
            image: faker.image.lorempicsum.imageUrl(200, 100),
            price: parseInt(faker.commerce.price()),
        })

        await createLink(
            user,
            [product]
        )
    }

    process.exit();

}).catch((error) => console.log(error));