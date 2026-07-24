import { Model, Schema } from 'mongoose';
import { ICustomer, IOrder, IPaymentInfo, IAddress } from '../../../shared';
import {User} from "./user.model";

const addressSchema = new Schema<IAddress>({
    street: {
        type: String,
        required: true,
    },
    streetNumber: {
        type: String,
        required: true,
    },
    zipCode: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    bellName: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
    },
    fullAddress: {
        type: String,
        required: true,
    },
    floor: {
        type: String,
        required: true,
    },
});

const paymentInfoSchema = new Schema<IPaymentInfo>({
    cardNumber: {
        type: String,
        required: true,
    },
    cardHolder: {
        type: String,
        required: true,
    },
    cvc: {
        type: String,
        required: true,
    },
});

const customerSchema = new Schema<ICustomer>({
    orders: [{
        type: String,
    }],
    addresses: [{
        type: addressSchema,
        required: true,
    }],
    phoneNumber: {
        type: String,
        required: true,
    },
    paymentInfo: {
        type: paymentInfoSchema,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isDeactivated: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

const Customer: Model<ICustomer> = User.discriminator<ICustomer>(
    'Customer',
    customerSchema,
);

export { Customer, customerSchema };
