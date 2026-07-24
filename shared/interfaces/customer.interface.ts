import {IUser} from "./user.interface";
import {IOrder} from "./order.interface";
import {IAddress} from "./address.interface";
import {IPaymentInfo} from "./paymentInfo.interface";

export interface ICustomer extends IUser {
    _id: string;
    orders: IOrder[];
    addresses: IAddress[];
    phoneNumber: string;
    paymentInfo: IPaymentInfo;
    isVerified: boolean;
    isDeactivated: boolean;
}