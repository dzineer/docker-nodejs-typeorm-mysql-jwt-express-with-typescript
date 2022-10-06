import {AppDataSource} from "../utils/data-source";
import {createProduct} from "../services/product.service";
import { faker } from '@faker-js/faker';

AppDataSource.initialize().then(async () => {
   // const repository = get
    for(let i=0; i < 30; i++) {
        await createProduct({
            title: faker.commerce.product(),
            description: faker.commerce.productDescription(),
            image: faker.image.lorempicsum.imageUrl(200, 100),
            price: parseInt(faker.commerce.price()),
        })
    }

    process.exit();

}).catch((error) => console.log(error));