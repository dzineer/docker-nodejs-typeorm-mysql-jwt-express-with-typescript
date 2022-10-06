import {Request, Response} from "express";
import {createProduct, deleteProduct, getProductById, getProducts, updateProduct} from "../services/product.service";

export const index =  async (req: Request, res: Response) => {
    const products = await getProducts(false, 'products')

    return res.status(200).send({
        status: 200,
        data: {
            products
        }
    })
}

export const show =  async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await getProductById( parseInt(id) )

    return res.status(200).send({
        status: 200,
        data: {
            product
        }
    })
}

export const destroy =  async (req: Request, res: Response) => {
    const { id } = req.params;
    await deleteProduct(parseInt(id));

    return res.status(200).send({
        status: 200,
        data: {
            message: "Product deleted successfully!"
        }
    })
}

export const store =  async (req: Request, res: Response) => {
    const { title, description, image, price } = req.body;
    const product = await createProduct({
        title,
        description,
        image,
        price
    })

    return res.status(200).send({
        status: 200,
        data: {
            product
        }
    })
}

export const update =  async (req: Request, res: Response) => {

    await updateProduct(parseInt(req.params.id), req.body)

    return res.status(200).send({
        status: 200,
        data: {
            message: 'Product updated successfully!'
        }
    })
}

export const ProductController = {
    index,
    show,
    store,
    update,
    destroy
}
