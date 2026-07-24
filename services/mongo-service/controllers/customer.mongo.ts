import { Customer } from "../models/customer.model";
import {IAddress, ICustomer, IMongoResponse} from "../../../shared";
import {FilterQuery, UpdateQuery, UpdateWithAggregationPipeline} from "mongoose";
import {errors} from "../../shared";

const defaultFieldsReturned = 'username email firstName lastName orders addresses phoneNumber paymentInfo isVerified isDeactivated';

export const createCustomer = async (
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phoneNumber: string,
): Promise<IMongoResponse> => {
    try {
        const newCustomer = new Customer({
            username,
            firstName,
            lastName,
            email,
            password,
            addresses: [],
            phoneNumber,
            isVerified: false,
            isDeactivated: false,
        });
        const savedCustomer = await newCustomer.save();
        if (!savedCustomer) {
            return errors['C501'];
        }

        const customerToReturn = await Customer.findById(
            savedCustomer.id,
        ).select(defaultFieldsReturned);
        if (!customerToReturn) {
            return errors['C406'];
        }

        return {
            status: 200,
            data: {
                customer: customerToReturn,
            },
        };
    } catch (e: any) {
        console.error(e);

        if (e.code === 11000 && e.keyValue) {
            const keyValue: Record<string, any> = e.keyValue;
            return {
                status: 400,
                errorCode: 'C404',
                errorDescription: `Duplicate key error. Field '${Object.keys(keyValue)[0]}' with value '${keyValue[Object.keys(keyValue)[0]]}' already exists.`,
            };
        } else {
            return {
                status: 500,
                errorCode: 'C500',
                errorDescription: 'Unexpected error occurred in createCustomer.',
            };
        }
    }
};

export const retrieveCustomers = async (filter: FilterQuery<ICustomer>): Promise<IMongoResponse> => {
    try {
        const customers = await Customer.find(filter).select(defaultFieldsReturned);
        if (!customers) {
            return errors['C405'];
        }
        return {
            status: 200,
            data: { users: customers },
        };
    } catch (e) {
        return {
            status: 500,
            errorCode: 'CA500',
            errorDescription: 'Unexpected error occurred in retrieveCustomers.',
        };
    }
};

export const updateCustomer = async (userId: string, updateQuery: UpdateQuery<ICustomer> | UpdateWithAggregationPipeline): Promise<IMongoResponse> => {
    try {
        const updatedCustomer = await Customer.updateOne(
            { _id: userId },
            updateQuery
        );
        if (!updatedCustomer) {
            return errors['C502'];
        }
        const customerToReturn = await Customer.findById(userId).select(defaultFieldsReturned);
        if (!customerToReturn) {
            return errors['C406'];
        }
        return {
            status: 200,
            data: { updatedUser:  customerToReturn},
        };
    } catch (e: any) {
        console.error(e);

        if (e.code === 11000 && e.keyValue) {
            const keyValue: Record<string, any> = e.keyValue;
            return {
                status: 400,
                errorCode: 'C404',
                errorDescription: `Duplicate key error. Field '${Object.keys(keyValue)[0]}' with value '${keyValue[Object.keys(keyValue)[0]]}' already exists.`,
            };
        } else {
            return {
                status: 500,
                errorCode: 'C500',
                errorDescription: 'Unexpected error occurred in updateCustomer.',
            };
        }
    }
}
