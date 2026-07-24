import {Request, Response} from "express";
import {authorizeUser, sendResponse} from "../utils";
import {errors} from "../../shared";
import {errorHandler} from "../utils/response.utils";
import {
    createOrder,
    deleteOrderFromMongo,
    retrieveOrders,
    updateOrder,
} from "../../mongo-service";
import {IOrder} from "../../../shared";
import jwt from "jsonwebtoken";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' });

export const createNewOrder = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.commerce_hub_token;
        if (!token) {
            await sendResponse({
                res,
                ...errors['U411'],
            });
            return;
        }
        const authorization = await authorizeUser(token);
        if (authorization.status !== 200) {
            await sendResponse({
                res,
                status: authorization.status,
                errorCode: authorization.errorCode,
                errorDescription: authorization.errorDescription,
            });
            return;
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || '');
        const userSessionId = (decodedToken as jwt.JwtPayload).id;
        const { products, address, totalPrice, paymentWay } = req.body;
        if (!products || !address || !totalPrice || !paymentWay) {
            await sendResponse({
                res,
                ...errors['O401'],
            });
            return;
        }

        let paymentIntentId: string | null = '';
        if (paymentWay === 'card') {
            // Create a PaymentIntent with Stripe
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Number.parseInt(totalPrice),
                currency: 'eur',
                payment_method_types: ['card'],
            });

            console.log(paymentIntent);

            paymentIntentId = paymentIntent.client_secret;
        }

        console.log({
            _user: userSessionId,
            products,
            status: 'received',
            timeReceived: (new Date()).toString(),
            timeCompleted: 'N/A',
            address,
            totalPrice,
            estimatedTime: 0,
            paymentWay,
            isPaid: false,
        })

        const createdOrder = await createOrder({
            _user: userSessionId,
            products,
            status: 'received',
            timeReceived: (new Date()).toString(),
            timeCompleted: 'N/A',
            address,
            totalPrice,
            estimatedTime: 0,
            paymentWay,
            isPaid: false,
        } as IOrder);
        createdOrder.data = {
            ...createdOrder.data,
            clientSecret: paymentWay === 'card' ? paymentIntentId : undefined,
        }
        console.log(createdOrder.data)
        await sendResponse({
            res,
            ...createdOrder,
        });
        return createdOrder;
    } catch (err) {
        await errorHandler(err, res, 'createNewOrder');
        return;
    }
};

export const editOrderData = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.commerce_hub_token;
        if (!token) {
            await sendResponse({
                res,
                ...errors['U411'],
            });
            return;
        }
        const authorization = await authorizeUser(token);
        if( authorization.status !== 200 ) {
            await sendResponse({
                res,
                status: authorization.status,
                errorCode: authorization.errorCode,
                errorDescription: authorization.errorDescription,
            });
            return;
        }
        const { products, status, timeReceived, timeCompleted, address, totalPrice, estimatedTime, paymentWay } = req.body;
        if (!products || !status || !timeReceived || !timeCompleted || !address || !totalPrice || !estimatedTime || !paymentWay) {
            await sendResponse({
                res,
                ...errors['O402'],
            });
            return;
        }
        const orderId = req.params.orderId;
        const updatedOrder = await updateOrder(orderId, {$set: {products, status, timeReceived, timeCompleted, address, totalPrice, estimatedTime, paymentWay}});
        await sendResponse({
            res,
            ...updatedOrder
        });
        return;
    } catch (err) {
        await errorHandler(err, res, 'editOrderData');
        return;
    }
};

export const completeOrder = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.commerce_hub_token;
        if (!token) {
            await sendResponse({
                res,
                ...errors['U411'],
            });
            return;
        }
        const authorization = await authorizeUser(token);
        if( authorization.status !== 200 ) {
            await sendResponse({
                res,
                status: authorization.status,
                errorCode: authorization.errorCode,
                errorDescription: authorization.errorDescription,
            });
            return;
        }

        const orderId = req.params.orderId;
        const updatedOrder = await updateOrder(orderId, {$set: {timeCompleted: (new Date()).toString(), status: 'completed'}});
        await sendResponse({
            res,
            ...updatedOrder
        });
        return;
    } catch (err) {
        await errorHandler(err, res, 'completeOrder');
        return;
    }
};

export const editIsPaid = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.commerce_hub_token;
        if (!token) {
            await sendResponse({
                res,
                ...errors['U411'],
            });
            return;
        }
        const authorization = await authorizeUser(token);
        if( authorization.status !== 200 ) {
            await sendResponse({
                res,
                status: authorization.status,
                errorCode: authorization.errorCode,
                errorDescription: authorization.errorDescription,
            });
            return;
        }

        const orderId = req.params.orderId;
        const updatedOrder = await updateOrder(orderId, {$set: {isPaid: true}});
        await sendResponse({
            res,
            ...updatedOrder
        });
        return;
    } catch (err) {
        await errorHandler(err, res, 'editIsPaid');
        return;
    }
};

export const cancelOrder = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.commerce_hub_token;
        if (!token) {
            await sendResponse({
                res,
                ...errors['U411'],
            });
            return;
        }
        const authorization = await authorizeUser(token);
        if( authorization.status !== 200 ) {
            await sendResponse({
                res,
                status: authorization.status,
                errorCode: authorization.errorCode,
                errorDescription: authorization.errorDescription,
            });
            return;
        }

        const orderId = req.params.orderId;
        const updatedOrder = await updateOrder(orderId, {$set: {timeCompleted: (new Date()).toString(), status: 'cancelled'}});
        await sendResponse({
            res,
            ...updatedOrder
        });
        return;
    } catch (err) {
        await errorHandler(err, res, 'completeOrder');
        return;
    }
};

export const setEstimatedTime = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.commerce_hub_token;
        if (!token) {
            await sendResponse({
                res,
                ...errors['U411'],
            });
            return;
        }
        const authorization = await authorizeUser(token);
        if( authorization.status !== 200 ) {
            await sendResponse({
                res,
                status: authorization.status,
                errorCode: authorization.errorCode,
                errorDescription: authorization.errorDescription,
            });
            return;
        }

        const orderId = req.params.orderId;
        const { estimatedTime } = req.body;
        if (!estimatedTime) {
            await sendResponse({
                res,
                ...errors['O403'],
            });
            return;
        }
        const updatedOrder = await updateOrder(orderId, {$set: {estimatedTime}});
        await sendResponse({
            res,
            ...updatedOrder
        });
        return;
    } catch (err) {
        await errorHandler(err, res, 'completeOrder');
        return;
    }
};

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.commerce_hub_token;
        if (!token) {
            await sendResponse({
                res,
                ...errors['U411'],
            });
            return;
        }
        const authorization = await authorizeUser(token);
        if( authorization.status !== 200 ) {
            await sendResponse({
                res,
                status: authorization.status,
                errorCode: authorization.errorCode,
                errorDescription: authorization.errorDescription,
            });
            return;
        }
        const orders = await retrieveOrders({});
        await sendResponse({
            res,
            ...orders
        });
        return;
    } catch (err) {
        await errorHandler(err, res, 'getAllOrders');
        return;
    }
};

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.commerce_hub_token;
        if (!token) {
            await sendResponse({
                res,
                ...errors['U411'],
            });
            return;
        }
        const authorization = await authorizeUser(token);
        if( authorization.status !== 200 ) {
            await sendResponse({
                res,
                status: authorization.status,
                errorCode: authorization.errorCode,
                errorDescription: authorization.errorDescription,
            });
            return;
        }
        const orderId = req.params.orderId;
        const order = await retrieveOrders({_id: orderId});
        await sendResponse({
            res,
            ...order
        });
        return;
    } catch (err) {
        await errorHandler(err, res, 'getOrderById');
        return;
    }
};

export const getOrdersByUser = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.commerce_hub_token;
        if (!token) {
            await sendResponse({
                res,
                ...errors['U411'],
            });
            return;
        }
        const authorization = await authorizeUser(token);
        if( authorization.status !== 200 ) {
            await sendResponse({
                res,
                status: authorization.status,
                errorCode: authorization.errorCode,
                errorDescription: authorization.errorDescription,
            });
            return;
        }
        const userId = req.params.userId;
        const order = await retrieveOrders({_user: userId});
        await sendResponse({
            res,
            ...order
        });
        return;
    } catch (err) {
        await errorHandler(err, res, 'getOrdersByUser');
        return;
    }
};

export const deleteOrder = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.commerce_hub_token;
        if (!token) {
            await sendResponse({
                res,
                ...errors['U411'],
            });
            return;
        }
        const authorization = await authorizeUser(token);
        if( authorization.status !== 200 ) {
            await sendResponse({
                res,
                status: authorization.status,
                errorCode: authorization.errorCode,
                errorDescription: authorization.errorDescription,
            });
            return;
        }
        const orderId = req.params.orderId;
        const deletedOrder = await deleteOrderFromMongo(orderId);
        await sendResponse({
            res,
            ...deletedOrder
        });
        return;
    } catch (err) {
        await errorHandler(err, res, 'deleteOrder');
        return;
    }
};
