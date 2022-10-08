import {AppDataSource} from '../utils/data-source';
import {FindManyOptions, FindOneOptions} from "typeorm";
import {Product} from "../entities/product.entity";
import {getCached} from "./cache.service";
import {User} from "../entities/user.entity";

const productRepository = AppDataSource.getRepository(Product);

export const createProduct = async (product: Partial<Product>) => {
    return await productRepository.save(
        productRepository.create(product)
    )
}

export const getAllProducts = async () => {
    console.log(`getting all products...`);
    return await productRepository.find();
}

export const getUserProducts = async (user:User) =>  {
   return await findProducts({
        user,
    })
}

export const getProducts = async (useCache: boolean = false, type: string) => {
    if (process.env.DEBUG) {
        console.log(`getProducts(useCache:${useCache}, '${type}')`);
    }

    if (useCache) {
        return await getCached(type,  getAllProducts, {
            EX: 60 * 30 // 30 minutes
        })
    } else {
        return await getAllProducts();
    }
}

export const searchProducts = async (s: string, useCache: boolean = false, type: string) => {
    if (process.env.DEBUG) {
        console.log(`getProducts(useCache:${useCache}, '${type}')`);
    }

    if (useCache) {
        return await getCached(type,  getAllProducts, {
            EX: 60 * 30 // 30 minutes
        })
    } else {
        return await getAllProducts();
    }
}

export const deleteProduct = async (id: number) => {
    return await productRepository.createQueryBuilder()
        .delete()
        .from(Product)
        .where("id = :id", { id: id })
        .execute()
}

export const getProductById = async (id: number) => {
    const findOneOptions: FindOneOptions = {
        where: {
            id: id
        }
    }
    return await productRepository.findOne(findOneOptions);
}

export const findProduct = async (options) => {
    const findOneOptions: FindOneOptions = {
        where: {
            ...options
        }
    }
    return await productRepository.findOne(findOneOptions);
}

export const findProducts = async (options) => {
    const findManyOptions: FindManyOptions = {
        where: {
            ...options
        }
    }
    return await productRepository.find(findManyOptions);
}

export const updateProduct = async (id: number, data: object) => {
    return await productRepository.update(id, data);
}

