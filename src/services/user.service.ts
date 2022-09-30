import {AppDataSource} from '../utils/data-source';
import {User} from '../entities/user.entity';
import {FindManyOptions, FindOneOptions} from "typeorm";
import * as bcrypt from "bcryptjs";

const userRepository = AppDataSource.getRepository(User);

export const createUser = async (input: Partial<User>) => {
    input.password = await bcrypt.hash(input.password, 10)

    return await userRepository.save(
        userRepository.create(input)
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

// export const getUserByType = async (emailAddress: string, isAmbassador: number ) => {
//     const findOneOptions: FindOneOptions = {
//         where: {
//             email: emailAddress,
//             is_ambassador: isAmbassador
//         }
//     }
//     return await userRepository.findOne(findOneOptions);
// }

export const getUserByType = async (emailAddress: string, isAmbassador: number ) => {
    const findOneOptions: FindOneOptions = {
        where: {
            email: emailAddress,
            is_ambassador: isAmbassador
        }
    }
    return await userRepository.findOne(findOneOptions);
}

export const getUsersByType = async (isAmbassador: number ) => {
    const options: FindManyOptions = {
        where: {
            is_ambassador: isAmbassador
        }
    }
    return await userRepository.find(options);
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
