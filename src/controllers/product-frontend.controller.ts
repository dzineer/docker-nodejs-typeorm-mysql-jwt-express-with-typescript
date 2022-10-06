import {Request, Response} from "express";
import {getProducts} from "../services/product.service";

export const index =  async (req: Request, res: Response) => {

    let products = await getProducts(true, 'public')

    return res.status(200).send({
        status: 200,
        data: {
            products
        }
    })
}

export const ProductFrontendController = {
    index,
}
