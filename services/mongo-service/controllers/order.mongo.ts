import {IMongoResponse, IOrder, IProduct} from "../../../shared";
import {errors} from "../../shared";
import {Order} from "../models/order.model";
import {FilterQuery, UpdateQuery, UpdateWithAggregationPipeline} from "mongoose";
import {Product} from "../models/product.model";

const defaultFieldsReturned = '_user products status timeReceived timeCompleted address totalPrice estimatedTime paymentWay isPaid';

export const createOrder = async (order: IOrder): Promise<IMongoResponse> => {
    try {
        console.log("-----------------------")
        console.log(order)
        console.log("-----------------------")
        const newOrder = new Order(order);
        console.log("-----------------------")
        console.log(newOrder)
        console.log("-----------------------")
        const savedOrder = await newOrder.save();
        if (!savedOrder) {
            return errors['O501'];
        }
        const orderToReturn = await Order.findById(
            savedOrder.id,
        ).select(defaultFieldsReturned);
        if (!orderToReturn) {
            return errors['O404'];
        }

        return {
            status: 200,
            data: {
                order: orderToReturn,
            },
        };
    } catch (e: any) {
        console.error(e);
        return {
            status: 500,
            errorCode: 'CA500',
            errorDescription: 'Unexpected error occurred in createCategory. Error: ' + e,
        };
    }
}

export const retrieveOrders = async (filter: FilterQuery<IOrder>): Promise<IMongoResponse> => {
    try {
        const orders = await Order.find(filter).select(defaultFieldsReturned).lean() as IOrder[];
        const products = await Product.find().lean() as IProduct[];

        if (!orders || orders.length === 0) {
            return errors['O404'];
        }

        const updatedOrders = orders.map(order => {
            order.products = order.products.map(orderProduct => {
                const foundProduct = products.find(product => product._id.toString() === orderProduct.product.toString());

                return {
                    ...orderProduct,
                    productName_en: foundProduct ? foundProduct.title_en : 'Unknown product',
                    productName_el: foundProduct ? foundProduct.title_el : 'Άγνωστο Προϊόν',
                };
            });
            return order;
        });

        return {
            status: 200,
            data: { orders: updatedOrders },
        };
    } catch (e) {
        return {
            status: 500,
            errorCode: 'O500',
            errorDescription: 'Unexpected error occurred in retrieveOrders. Error: ' + e,
        };
    }
};




export const updateOrder = async (orderId: string, updateQuery: UpdateQuery<IOrder> | UpdateWithAggregationPipeline): Promise<IMongoResponse> => {
    try {
        const updateOrder = await Order.updateOne(
            { _id: orderId },
            updateQuery
        );
        if (!updateOrder) {
            return errors['O502'];
        }
        const orderToReturn = await Order.findById(orderId).select(defaultFieldsReturned);
        if (!orderToReturn) {
            return errors['O404'];
        }
        return {
            status: 200,
            data: { updatedOrder:  orderToReturn},
        };
    } catch (e: any) {
        console.error(e);
        return {
            status: 500,
            errorCode: 'O500',
            errorDescription: 'Unexpected error occurred in updateOrder. Error: ' + e,
        };
    }
}

export const deleteOrderFromMongo = async (orderId: string):Promise<IMongoResponse> => {
    try {
        await Order.deleteOne({_id: orderId});
        return {
            status: 200,
            data: { message: 'Order was deleted successfully.' },
        };
    } catch (e) {
        return {
            status: 500,
            errorCode: 'O500',
            errorDescription: 'Unexpected error occurred in deleteOrderFromMongo. Error: ' + e,
        };
    }
}
