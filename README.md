# Working Docker with nodejs / typeorm / mysql / jwt / express / and typescript

## Let's get started with the Baseline

## Folder Structure


| File/Folder            | Description                                                  |                                                         |
| ---------------------- | ------------------------------------------------------------ | ------------------------------------------------------- |
| **.dbdata**            | Contains the mysql database                                  |                                                         |
| **config**             | Contains the configuration for the app                       |                                                         |
| **src**                | Contains the source of the app                               |                                                         |
| **src/controllers**    | Contains the controllers                                     | Naming conventions: <name>.controller.ts                |
| **src/entities**       | Contains the model definitions used by **typeorm** to deploy table(s) | Naming conventions: <name>.entity.ts                    |
| **src/migrations**     | To be determined                                             | Used to **migrate** and **revert** existing table data. |
| **src/subscribers**    | To be determined                                             | Used to keep information for subscribers?               |
| **src/utils**          | Utility modules                                              |                                                         |
| **index.ts**           | Entry point to our app                                       |                                                         |
| **routes.ts**          | Route definitions                                            |                                                         |
| **.dockerignore**      |                                                              |                                                         |
| **.gitignore**         |                                                              |                                                         |
| **docker-compose.yml** |                                                              |                                                         |
| **Dockerfile**         |                                                              |                                                         |
| **nodemon.json**       |                                                              |                                                         |
| **package.json**       |                                                              |                                                         |
| **package-lock.json**  |                                                              |                                                         |
| **README.md**          |                                                              |                                                         |
| **tsconfig.ts**        | TypeScript configuration file (lint rule, etc...)            |                                                         |
| **.env**               | Environment variables                                        |                                                         |



**Node.js package.json**

*Dependencies*

| Module         | Comment |      |
| ---------------- | ----------------------------------------------- | ---- |
| bcryptjs         | used to generate password using the hash method |      |
| config           |                                                 |      |
| mysql2           |                                                 |      |
| pg               |                                                 |      |
| reflect-metadata |                                                 |      |
| typeorm          |                                                 |      |
| cors             |                                                 |      |
| express          |                                                 |      |
| dotenv           |                                                 |      |
| dotenv-cli       |                                                 |      |
| winston          |                                                 |      |
| lodash           |                                                 |      |
| url-join-ts      |                                                 |      |
| moment           |                                                 |      |
| uuid             |                                                 |      |
| jsonwebtoken | | |
| cookie-parser | | |

*Install dependencies*


```bash
npm i bcryptjs config mysql2 pg reflect-metadata typeorm cors express dotenv nodemon dotenv-cli winston lodash url-join-ts moment uuid jsonwebtoken cookie-parser --save
```



*Dev Dependencies*

| Module         | Comment |      |
| ---------------- | ----------------------------------------------- | ---- |
| @types/bcryptjs |  |      |
| @types/config |                                                 |      |
| @types/cors |                                                 |      |
| @types/express |                                                 |      |
| @types/node |                                                 |      |
| nodemon   |                                                 |      |
| ts-node    |                                                 |      |
| typescript |                                                 |      |
| @types/jsonwebtoken | | |
| @types/dotenv | | |
| @types/cookie-parser | | |



**Install dev dependencies**

```bash
npm i @types/bcryptjs @types/config @types/cors @types/express @types/node nodemon ts-node typescript @types/jsonwebtoken @types/dotenv @types/cookie-parser -D
```



**Environment Variables**

| Name                 | Value              |
| ---------------------- | ------------------------ |
| ADMIN_USER_JWT_SECRET_KEY | xxxxxxxxxxxxxxxxxxxxxxxxxx |
| BASIC_USER_JWT_SECRET_KEY | xxxxxxxxxxxxxxxxxxxxxxxxxx |

.env

```
# Generated using https://www.javainuse.com/jwtgenerator | Algorithm": H2256
# {
#    "Issuer": "Company Name",
#    "Issued At": "Date",
#    "Expiration": "Date",
#    "Username": "Company",
#    "Role": "AdminUser"
# }

ADMIN_USER_JWT_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# {
#    "Issuer": "Company Name",
#    "Issued At": "Date",
#    "Expiration": "Date",
#    "Username": "Company",
#    "Role": "BasicUser"
# }

BASIC_USER_JWT_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```




**Data Source Utility**

Typeorm Data Source

*dependencies*

| Module           | Description              |      |
| ---------------- | ------------------------ | ---- |
| reflect-metadata |                          |      |
| DataSource       | From the typeorm package |      |
| config           |                          |      |

src/utilities/data-source.ts

```js
import "reflect-metadata"
// import config from 'config'
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "db",
    port: 3306,
    username: "root",
    password: "root",
    database: "ambassador",
    synchronize: true,
    logging: false,
    entities: ['src/entities/**/*.ts'],
    migrations: ['src/migrations/**/*.ts'],
    subscribers: ['src/subscribers/**/*.ts'],
})
```



**Entities**

User Entity

*dependencies*

| Module                 | Description              |      |
| ---------------------- | ------------------------ | ---- |
| Column                 | From the typeorm package |      |
| Entity                 | From the typeorm package |      |
| PrimaryGeneratedColumn | From the typeorm package |      |

src/entities/user.entity.ts

```js
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_name!: string;

    @Column()
    last_name!: string;

    @Column({
        unique: true
    })
    email!: string;

    @Column()
    password: string;

    @Column()
    is_ambassador: boolean;
}
```



**Services**

User Service

*dependencies*

| Module                 | Description            |      |
| ---------------------- | ---------------------- | ---- |
| AppDataSource          | Our typeorm definition |      |
| User                   | User entity            |      |
| bcryptjs from bcryptjs |                        |      |

src/services/user.service.ts

```js
import { AppDataSource } from '../utils/data-source';
import { User } from '../entities/user.entity';
import {FindOneOptions} from "typeorm";
import * as bcrypt from "bcryptjs";

const userRepository = AppDataSource.getRepository(User);

export const createUser = async (input: Partial<User>) => {
    const password = await bcrypt.hash(input.password, 10);

    return await userRepository.save(
        userRepository.create({password, ...input})
    )
}

export const getUserWithIdPassword = async (emailAddress: string, isAmbassador: number ) => {
    const findOneOptions: FindOneOptions = {
        where: {
            email: emailAddress,
            is_ambassador: isAmbassador
        },
        select: ["id", "password"]
    }
    return await userRepository.findOne(findOneOptions);
}

export const getUserByType = async (emailAddress: string, isAmbassador: number ) => {
    const findOneOptions: FindOneOptions = {
        where: {
            email: emailAddress,
            is_ambassador: isAmbassador
        }
    }
    return await userRepository.findOne(findOneOptions);
}

export const getUserById = async (id: number) => {
    const findOneOptions: FindOneOptions = {
        where: {
            id: id
        }
    }
    return await userRepository.findOne(findOneOptions);
}

export const updateUser = async (id: number, data: object) => {
    console.info(`id: ${id}: data: `, data)
    return await userRepository.update(id, data);
}

export const updateUserPassword = async (id: number, newPassword: string) => {
    const password = await bcrypt.hash(newPassword, 10);
    return await userRepository.update(id, { password });
}
```



Auth Service

*dependencies*

| Module                              | Description       |      |
| ----------------------------------- | ----------------- | ---- |
| JwtHeader, JwtPayload, sign, verify | From jsonwebtoken |      |
| User                                | User entity       |      |
| getUserById                         | From User Service |      |


src/services/auth.service.ts

```js
import {JwtHeader, JwtPayload, sign, verify} from "jsonwebtoken";
import {User} from "../entities/user.entity";
import {getUserById} from "./user.service";

export const genUserToken = (user: User, userType: string) => {
    if (userType === 'BasicUser') {
        return sign({
            id: user.id
        }, process.env.BASIC_USER_JWT_SECRET_KEY)
    }
    else if (userType === 'AdminUser') {
        return sign({
            id: user.id
        }, process.env.ADMIN_USER_JWT_SECRET_KEY)
    }

    return null;
}

export const getAuthenticatedUser = async (jwt: string, userType: string) => {
    let payload: JwtPayload

    if (userType === 'BasicUser') {
        payload = verify(jwt, process.env.BASIC_USER_JWT_SECRET_KEY) as JwtPayload
    }
    else if (userType === 'AdminUser') {
        payload = verify(jwt, process.env.ADMIN_USER_JWT_SECRET_KEY) as JwtPayload
    }

    if (!payload) {
        return false
    }

    const user = await getUserById( payload.id )

    return user;
}
```



**Controllers**

Auth Controllers

*dependencies*

| Module                                                     | Description                    |      |
| ---------------------------------------------------------- | ------------------------------ | ---- |
| Request, Response                                          | From the express package       |      |
| createUser, getUserById, getUserWithIdPassword, updateUser | from src/services/user.service |      |
| bcryptjs                                                   | Form bcryptjs                  |      |
| genUserToken, getAuthenticatedUser                         |                                |      |

src/controllers/user/user-auth.controller.ts

```js
import {Request, Response} from 'express';
import {
    createUser,
    getUserById,
    getUserWithIdPassword,
    updateUser,
    updateUserPassword
} from '../../services/user.service';
import { genUserToken, getAuthenticatedUser } from '../../services/auth.service';

import * as bcrypt from 'bcryptjs';
import {JwtPayload, verify} from "jsonwebtoken";

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export const login =  async (req: Request, res: Response) => {

    const { email, password } = req.body;
    const user = await getUserWithIdPassword(email, 1)

    if (!user) {
        return res.status(400).send({
            status: 400,
            data: {
                message: "Invalid credentials!"
            }
        })
    }

    if (!await bcrypt.compare(password, user.password)) {
        return res.status(400).send({
            status: 400,
            data: {
                message: "Invalid credentials!"
            }
        })
    }

    const token = genUserToken(user, "BasicUser")

    res.cookie("jwt", token,
        {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS
    })

    return res.status(400).send({
        status: 200,
        data: {
            message: "Successfully logged in!",
        }
    })

}

export const authenticatedUser =  async (req: Request, res: Response) => {
    return res.status(200).send({
        status: 200,
        data: {
            user: req["user"]
        }
    })
}

export const registerUser = async (req: Request, res: Response) => {
    const { password, password_confirm, email, ...body } = req.body;

    if (password !== password_confirm) {
        return res.status(400).send({
            message: "Password's do not match"
        })
    }

    try {
        const newUser = await createUser({
            ...body,
            email: email.toLowerCase(),
            password,
            is_ambassador: true
        })

        res.send('User created successfully!')
    }
    catch (err: any) {
        if (err.errno === 1062) {
            return res.status(400).send({
                data: {
                    message: 'User with that email already exist',
                },
                status: 400
            })
        } else {
            return res.status(400).send({
                data: {
                    message: 'Error: User was not created!',
                },
                status: 400
            })
        }

    }
}

export const logout =  async (req: Request, res: Response) => {
    res.cookie("jwt", "", { maxAge:0} )
    return res.status(400).send({
        status: 200,
        data: {
            message: "Successfully logged out!",
        }
    })
}

export const updateInfo =  async (req: Request, res: Response) => {
    const userInfo = req['user'];
    await updateUser(userInfo.id, {
        ...req.body
    })
    const user = await  getUserById(userInfo.id)
    return res.status(400).send({
        status: 200,
        data: {
            user,
        }
    })
}

export const updatePassword =  async (req: Request, res: Response) => {
    const userInfo = req['user'];
    const { password, password_confirm } = req.body;

    if (password !== password_confirm) {
        return res.status(400).send({
            message: "Password's do not match"
        })
    }

    await updateUserPassword(userInfo.id, password);

    return res.status(400).send({
        status: 200,
        data: {
            message: 'Password updated.',
        }
    })
}

export const UserAuthController = {
    registerUser,
    authenticatedUser,
    login,
    logout,
    updateInfo,
    updatePassword
}
```



*dependencies*

| Module                                                     | Description                    |      |
| ---------------------------------------------------------- | ------------------------------ | ---- |
| Request, Response                                          | From the express package       |      |
| createUser, getUserById, getUserWithIdPassword, updateUser | from src/services/user.service |      |
| bcryptjs                                                   | Form bcryptjs                  |      |
| genUserToken, getAuthenticatedUser                         |                                |      |

src/controllers/admin/admin-auth.controller.ts

```js
import {Request, Response} from 'express';
import {
    createUser,
    getUserById,
    getUserWithIdPassword,
    updateUser,
    updateUserPassword
} from '../../services/user.service';
import { genUserToken, getAuthenticatedUser } from '../../services/auth.service';

import * as bcrypt from 'bcryptjs';
import {JwtPayload, verify} from "jsonwebtoken";

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export const login =  async (req: Request, res: Response) => {

    const { email, password } = req.body;
    const user = await getUserWithIdPassword(email, 0)

    if (!user) {
        return res.status(400).send({
            status: 400,
            data: {
                message: "Invalid credentials!"
            }
        })
    }

    if (!await bcrypt.compare(password, user.password)) {
        return res.status(400).send({
            status: 400,
            data: {
                message: "Invalid credentials!"
            }
        })
    }

    const token = genUserToken(user, "AdminUser")

    res.cookie("jwt", token,
        {
            httpOnly: true,
            maxAge: ONE_DAY_IN_MS
        })

    return res.status(400).send({
        status: 200,
        data: {
            message: "Successfully logged in!",
        }
    })

}

export const authenticatedUser =  async (req: Request, res: Response) => {
    return res.status(400).send({
        status: 200,
        data: {
            user: req["user"]
        }
    })
}

export const registerUser = async (req: Request, res: Response) => {
    const { password, password_confirm, email, ...body } = req.body;

    if (password !== password_confirm) {
        return res.status(400).send({
            message: "Password's do not match"
        })
    }

    try {
        const newUser = await createUser({
            ...body,
            email: email.toLowerCase(),
            password,
            is_ambassador: false
        })

        res.send('User created successfully!')
    }
    catch (err: any) {
        if (err.errno === 1062) {
            return res.status(400).send({
                data: {
                    message: 'User with that email already exist',
                },
                status: 400
            })
        } else {
            return res.status(400).send({
                data: {
                    message: 'Error: User was not created!',
                },
                status: 400
            })
        }

    }
}

export const logout =  async (req: Request, res: Response) => {
    res.cookie("jwt", "", { maxAge:0} )
    return res.status(400).send({
        status: 200,
        data: {
            message: "Successfully logged out!",
        }
    })
}

export const updateInfo =  async (req: Request, res: Response) => {
    const userInfo = req['user'];
    await updateUser(userInfo.id, {
        ...req.body
    })
    const user = await  getUserById(userInfo.id)
    return res.status(400).send({
        status: 200,
        data: {
            user,
        }
    })
}

export const updatePassword =  async (req: Request, res: Response) => {
    const userInfo = req['user'];
    const { password, password_confirm } = req.body;

    if (password !== password_confirm) {
        return res.status(400).send({
            message: "Password's do not match"
        })
    }

    await updateUserPassword(userInfo.id, password);

    return res.status(400).send({
        status: 200,
        data: {
            message: 'Password updated.',
        }
    })
}

export const AdminAuthController = {
    registerUser,
    authenticatedUser,
    login,
    logout,
    updateInfo,
    updatePassword
}
```



Route Middleware

**Admin Auth Middleware**

*dependencies*

| Module                          | Description                    |      |
| ------------------------------- | ------------------------------ | ---- |
| NextFunction, Request, Response | From the express package       |      |
| getAuthenticatedUser            | from src/services/auth.service |      |

src/middleware/auth-admin.middleware.ts


```js
import {NextFunction, Request, Response} from "express";
import {getAuthenticatedUser} from "../services/auth.service";

export const adminAuthMiddleware =  async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jwt = req.cookies.jwt;
        const user = await getAuthenticatedUser(jwt, 'AdminUser')
        req["user"] = user;
        next()
    }
    catch (err) {
        return res.status(401).send({
            status: 401,
            data: {
                message: 'unauthenticated'
            }
        })
    }

}
```



**Basic User Auth Middleware**

*dependencies*

| Module                          | Description                    |      |
| ------------------------------- | ------------------------------ | ---- |
| NextFunction, Request, Response | From the express package       |      |
| getAuthenticatedUser            | from src/services/auth.service |      |

src/middleware/auth-admin.middleware.ts


```js
import {NextFunction, Request, Response} from "express";
import {getAuthenticatedUser} from "../services/auth.service";

export const adminAuthMiddleware =  async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jwt = req.cookies.jwt;
        const user = await getAuthenticatedUser(jwt, 'BasicUser')
        req["user"] = user;
        next()
    }
    catch (err) {
        return res.status(401).send({
            status: 401,
            data: {
                message: 'unauthenticated'
            }
        })
    }

}
```



### Routes

Our Routes

**Admin Routes**

*dependencies*

| Module              | Description                                      |      |
| ------------------- | ------------------------------------------------ | ---- |
| Router              | From the express package                         |      |
| AdminAuthController | from src/controllers/admin/admin-auth.controller |      |
| adminAuthMiddleware | from src/middleware/admin-auth.middleware        |      |

src/admin-user-routes.ts


```js
import {Router} from "express";
import { AdminAuthController } from "../controllers/admin/admin-auth.controller";
import {adminAuthMiddleware} from "../middleware/admin-auth.middleware";
import {userAuthMiddleware} from "../middleware/user-auth.middleware";

export const adminRoutes = (router: Router) => {
    router.post('/api/admin/register', AdminAuthController.registerUser)
    router.post('/api/admin/login', AdminAuthController.login)
    router.post('/api/user/logout', adminAuthMiddleware, AdminAuthController.logout)
    router.get('/api/admin', adminAuthMiddleware, AdminAuthController.authenticatedUser)
    router.put('/api/user/info', userAuthMiddleware, AdminAuthController.updateInfo)
    router.put('/api/password', userAuthMiddleware, AdminAuthController.updatePassword)
}
```



**Basic User Routes**

*dependencies*

| Module              | Description                                    |      |
| ------------------- | ---------------------------------------------- | ---- |
| Router              | from the express package                       |      |
| UserAuthController  | from src/controllers/user/user-auth.controller |      |
| adminAuthMiddleware | from src/middleware/user-auth.middleware       |      |

src/basic-user-routes.ts


```js
import {Router} from "express";
import {UserAuthController} from "../controllers/user/user-auth.controller";
import {userAuthMiddleware} from "../middleware/user-auth.middleware";

export const basicUserRoutes = (router: Router) => {
    router.post('/api/user/register', UserAuthController.registerUser )
    router.post('/api/user/login', UserAuthController.login)
    router.post('/api/user/logout', userAuthMiddleware, UserAuthController.logout)
    router.get('/api/user', userAuthMiddleware, UserAuthController.authenticatedUser)
    router.put('/api/user/info', userAuthMiddleware, UserAuthController.updateInfo)
    router.put('/api/password', userAuthMiddleware, UserAuthController.updatePassword)
}
```



**Index**

Our Entry Point to our App

*dependencies*

| Module                       | Description            |      |
| ---------------------------- | ---------------------- | ---- |
| express                      |                        |      |
| Request, Response            | from express           |      |
| config                       |                        |      |
| AppDataSource                | Our typeorm definition |      |
| cors                         |                        |      |
| adminRoutes, basicUserRoutes | Our defined routes     |      |

src/index.ts


```js
import * as express from "express"
import { Request, Response } from "express"
import config from 'config';
import { AppDataSource } from './utils/data-source'
import * as cors from 'cors';
/**
* Routes
*/
import { adminRoutes } from "./routes/admin-user-routes";
import { basicUserRoutes } from "./routes/basic-user-routes";

import * as dotenv from 'dotenv'
import * as cookieParser from 'cookie-parser'

dotenv.config()

AppDataSource.initialize().then(async () => {
    const app = express()

    app.use(express.json())

    // let’s you use the cookieParser in your application
    app.use(cookieParser());

    app.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true,
        })
    );

    adminRoutes(app)
    basicUserRoutes(app)

    app.listen(8000, () => {
        console.log(`listing to port:8000`)
    })

}).catch((error) => console.log(error));

```



**Seeders**

Seed ambassador

*dependencies*

| Module                       | Description                    |      |
| ---------------------------- | ------------------------------ | ---- |
| AppDataSource                | Our typeorm definition         |      |
| createUser                   | from src/services/user.service |      |
| faker                        | @faker-js/faker                |      |


src/seeder/ambassador.seeder.ts

```js
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
```



## Commands


| Module           | Description                             |      |
| ---------------- | --------------------------------------- | ---- |
| start            | ts-node src/index.ts                    |      |
| typeorm          | typeorm-ts-node-commonjs                |      |
| seed:ambassadors | ts-node src/seeder/ambassador.seeder.ts |      |
| backend:shell    | docker-compose exec backend bash        |      |

