import {IAddress} from "./address.interface";

export interface IOrderProductEntry {
    product: string;
    quantity: number;
    ingredients: string[];
    options: string[];
    price: string;
    comment?: string;
}
export interface IOrder {
    _id?: string;
    _user: string;
    products: IOrderProductEntry[];
    status: 'received' | 'completed' | 'cancelled';
    timeReceived: string;
    timeCompleted: string;
    address: IAddress;
    totalPrice: string;
    estimatedTime: number;
    paymentWay: 'cash' | 'card';
    isPaid: boolean;
}