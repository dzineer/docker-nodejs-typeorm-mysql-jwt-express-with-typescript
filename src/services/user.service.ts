import { AppDataSource } from '../utils/data-source';
import { User } from '../entities/user.entity';
import {FindOneOptions} from "typeorm";

const userRepository = AppDataSource.getRepository(User);

export const createUser = async (input: Partial<User>) => {
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

