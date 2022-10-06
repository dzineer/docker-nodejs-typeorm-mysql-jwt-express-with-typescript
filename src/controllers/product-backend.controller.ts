import {Request, Response} from "express";
import {getProducts} from "../services/product.service";
import {Product} from "../entities/product.entity";
import {pageinate} from "../utils/paginate.utils";

export const index =  async (req: Request, res: Response) => {

    let products:Product[] = await getProducts(true, 'products')

    if (req.query.s) {
        const s = req.query.s.toString().toLowerCase();
        products = products.filter( p => p.title.toLowerCase().indexOf(s) >= 0 ||
            p.description.toLowerCase().indexOf(s) >= 0)
    }

    // 0  - prices match
    // -1 - sort in ascending order -1
    // 1  - sort in descending order 1
    if(req.query.sort === 'asc' || req.query.sort === 'desc') {
        products = products.sort((a,b) => {
            const diff = a.price - b.price; // -1, or 0, or 1
            if (diff === 0) {
                return 0;
            }
            // -1 or 1
            const sign = Math.abs(diff) / diff;  // -1 (descending), or 1 (ascending)
            return req.query.sort === 'asc' ? sign : -sign;
        })
    }

    const page: number = parseInt(req.query.page as string) || 1;
    const perPage:number = parseInt(req.query.perPage as string) || 9;

    const paginatedData = pageinate(products, page, perPage)

    return res.status(200).send({
        status: 200,
        data: paginatedData
    })
}

export const ProductBackendController = {
    index,
}
