import Stripe from 'stripe';
const apiVersion = '2022-08-01'

export const initStripe = async (secret: string ) => {
    return new Stripe(secret, {
        apiVersion
    });
}

export const createStripeSession = async (connection, mode: string, line_items, urls) => {
    const source = await connection.checkout.sessions.create({
        payment_method_types: ['card'],
        mode,
        line_items,
        success_url: urls.success_url,
        cancel_url: urls.cancel_url,
    });
    return source;
}

export const StripeService = {
    init: initStripe,
    createSource: createStripeSession
}