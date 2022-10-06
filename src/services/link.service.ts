import {AppDataSource} from '../utils/data-source';
import {FindManyOptions, FindOneOptions, FindOptionsWhere} from "typeorm";
import {Link} from "../entities/link.entity";
import {WhereClause} from "typeorm/query-builder/WhereClause";
import {getUserById} from "./user.service";
import {User} from "../entities/user.entity";
import {Product} from "../entities/product.entity";

const linkRepository = AppDataSource.getRepository(Link);

export const createLink = async (user: User, products: Product[]) => {

    return await linkRepository.save(
        linkRepository.create({
            user,
            code: Math.random().toString(36).substring(6),
            products
        })
    )
}

export const getUserLinks = async (user_id: number) => {
    const foundUser = await getUserById(user_id);

    return await linkRepository.find({
        where: {
            user: foundUser
        },
        relations: ['orders', 'orders.order_items'],
    })
}

export const getLinks = async () => {
    return await linkRepository.find();
}

export const deleteLink = async (id: number) => {
    return await linkRepository.createQueryBuilder()
        .delete()
        .from(Link)
        .where("id = :id", { id: id })
        .execute()
}

export const getLinkById = async (id: number) => {
    const findOneOptions: FindOneOptions = {
        where: {
            id: id
        }
    }
    return await linkRepository.findOne(findOneOptions);
}

export const getLinkByCode = async (code: string) => {
    const findOneOptions: FindOneOptions = {
        where: {
            code
        },
        relations: ['user', 'products']
    }
    return await linkRepository.findOne(findOneOptions);
}

export const findLink = async (options) => {
    const findOneOptions: FindOneOptions = {
        where: {
            ...options
        }
    }
    return await linkRepository.findOne(findOneOptions);
}

export const updateLink = async (id: number, data: object) => {
    return await linkRepository.update(id, data);
}

