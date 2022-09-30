import {AppDataSource} from "../utils/data-source";
import {createUser} from "../services/user.service";
import { faker } from '@faker-js/faker';

AppDataSource.initialize().then(async () => {
   // const repository = get
    for(let i=0; i < 30; i++) {
        await createUser({
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            email: faker.internet.email(),
            password: 'password',
            is_ambassador: true
        })
    }

    process.exit();

}).catch((error) => console.log(error));