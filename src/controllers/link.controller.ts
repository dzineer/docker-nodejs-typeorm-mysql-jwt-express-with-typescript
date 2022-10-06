import {Request, Response} from "express";
import {
    createLink,
    deleteLink,
    getLinkById,
    updateLink,
    getLinks,
    getUserLinks,
    getLinkByCode
} from "../services/link.service";
import {getUserProducts} from "../services/product.service";
import {Product} from "../entities/product.entity";

export const index =  async (req: Request, res: Response) => {
    const links = await getLinks()

    return res.status(200).send({
        status: 200,
        data: {
            links
        }
    })
}

export const show =  async (req: Request, res: Response) => {
    const { code } = req.params;
    const link = await getLinkByCode(code)

    return res.status(200).send({
        status: 200,
        data: {
            link
        }
    })
}


export const destroy =  async (req: Request, res: Response) => {
    const { id } = req.params;
    await deleteLink(parseInt(id));

    return res.status(200).send({
        status: 200,
        data: {
            message: "Link deleted successfully!"
        }
    })
}

export const store =  async (req: Request, res: Response) => {
    const user = req['user'];
    const { code } = req.body;

    // const products = await getUserProducts(user);

    const products = req.body.products.map( id => ( { id } ))

    const link = await createLink(
        user,
        products
    )

    return res.status(200).send({
        status: 200,
        data: {
            link
        }
    })
}

export const userStats =  async (req: Request, res: Response) => {
    const user = req['user'];
    const { code } = req.body;

    // const products = await getUserProducts(user);

    const products = req.body.products.map( id => ( { id } ))

    const link = await createLink(
        user,
        products
    )

    return res.status(200).send({
        status: 200,
        data: {
            link
        }
    })
}

export const update =  async (req: Request, res: Response) => {

    await updateLink(parseInt(req.params.id), req.body)

    return res.status(200).send({
        status: 200,
        data: {
            message: 'Link updated successfully!'
        }
    })
}

export const LinkController = {
    index,
    show,
    store,
    update,
    destroy
}
