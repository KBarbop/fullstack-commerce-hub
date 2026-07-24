import { Model, model, Schema, Types } from 'mongoose';
import { IOrder, IOrderProductEntry, IAddress } from '../../../shared';

const orderProductEntrySchema = new Schema<IOrderProductEntry>({
    product: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    ingredients: [{
        type: String,
        required: true,
    }],
    options: [{
        type: String,
        required: true,
    }],
    price: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
    },
});

const addressSchema = new Schema<IAddress>({
    street: {
        type: String,
    },
    streetNumber: {
        type: String,
    },
    zipCode: {
        type: String,
    },
    city: {
        type: String,
    },
    bellName: {
        type: String,
    },
    comment: {
        type: String,
    },
    fullAddress: {
        type: String,
    },
    floor: {
        type: String,
    },
});

const orderSchema = new Schema<IOrder>({
    _user: {
        type: String,
        required: true,
    },
    products: [{
        type: orderProductEntrySchema,
        required: true,
    }],
    status: {
        type: String,
        enum: ['received', 'completed', 'cancelled'],
        required: true,
    },
    timeReceived: {
        type: String,
    },
    timeCompleted: {
        type: String,
    },
    address: {
        type: addressSchema,
        required: true,
    },
    totalPrice: {
        type: String,
        required: true,
    },
    estimatedTime: {
        type: Number,
        required: true,
    },
    paymentWay: {
        type: String,
        enum: ['cash', 'card'],
        required: true,
    },
    isPaid: {
        type: Boolean,
        required: true,
    },
});

orderSchema.index({ status: 1, timeReceived: 1 });

const Order: Model<IOrder> = model('Order', orderSchema);

export { Order, orderSchema };
