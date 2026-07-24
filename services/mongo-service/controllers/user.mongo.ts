import { User } from '../models/user.model';
import { IMongoResponse, IUser } from '../../../shared';
import {FilterQuery, UpdateQuery, UpdateWithAggregationPipeline} from 'mongoose';
import {Customer} from "../models/customer.model";
import {Admin} from "../models/admin.model";
import {errors} from "../../shared"

const defaultFieldsReturned = 'username email firstName lastName';
const customerDefaultFieldsReturned = 'username email firstName lastName orders addresses phoneNumber paymentInfo isVerified isDeactivated';
const adminDefaultFieldsReturned = 'username email firstName lastName role';

export const authenticateUser = async (email: string, password: string): Promise<IMongoResponse> => {
    try {
        if (!email || !password) {
            return errors['U401'];
        }
        const foundUser = await User.findOne({email}) as IUser;
        if (!foundUser) {
            return errors['U402'];
        }
        if (foundUser.matchPassword) {
            const match = await foundUser.matchPassword(password);
            if (!match) {
                return errors['U402'];
            }
        }
        const userToReturn = await User.findById(foundUser._id).select(defaultFieldsReturned);
        if (!userToReturn) {
            return errors['U404'];
        }
        return {
            status: 200,
            data: {
                user: userToReturn,
            },
        };
    } catch (e) {
        console.error(e);
        return {
            status: 500,
            errorCode: 'U500',
            errorDescription: 'Unexpected error occurred in authenticateUser.',
        };
    }
};

export const retrieveUser = async (filter: FilterQuery<IUser>): Promise<IMongoResponse> => {
    try {
        const user = await User.findOne(filter) as IUser;
        if (!user) {
            return errors['U405'];
        }
        switch (user.__t){
            case 'Customer':
                const customer = await Customer.findOne(filter).select(customerDefaultFieldsReturned);
                return {
                    status: 200,
                    data: { user: customer },
                };
            case 'Admin':
                const admin = await Admin.findOne(filter).select(adminDefaultFieldsReturned);
                return {
                    status: 200,
                    data: { user: admin },
                };
            case 'User':
                return {
                    status: 200,
                    data: { user },
                };
            default:
                return errors['U407'];
        }
    } catch (e) {
        console.error(e);
        return {
            status: 500,
            errorCode: 'U500',
            errorDescription: 'Unexpected error occurred in retrieveUser.',
        };
    }
};


export const retireveUsers = async (filter: FilterQuery<IUser>): Promise<IMongoResponse> => {
    try {
        const users = await User.find(filter).select(defaultFieldsReturned);
        if (!users) {
            return errors['U404'];
        }
        return {
            status: 200,
            data: { users },
        };
    } catch (e) {
        console.error(e);
        return {
            status: 500,
            errorCode: 'U500',
            errorDescription: 'Unexpected error occurred in retireveUsers.',
        };

    }
};

export const updateUser = async (userId: string, updateQuery: UpdateQuery<IUser> | UpdateWithAggregationPipeline): Promise<IMongoResponse> => {
    try {
        const updatedUser = await User.updateOne(
            { _id: userId },
            updateQuery
        );
        if (!updatedUser) {
            return errors['U502'];
        }
        const userToReturn = await User.findById(userId).select(defaultFieldsReturned);
        if (!userToReturn) {
            return errors['U404'];
        }
        return {
            status: 200,
            data: { updatedUser:  userToReturn},
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
                errorCode: 'U500',
                errorDescription: 'Unexpected error occurred in updateUser.',
            };
        }
    }
}


export const deleteUserFromMongo = async (userId: string): Promise<IMongoResponse> => {
    try {
        const user = await User.findById(userId) as IUser;
        if (!user) {
            return errors['U404'];
        }
        switch (user.__t) {
            case 'User':
                await User.deleteOne({ _id: userId });
                return {
                    status: 200,
                    data: { message: 'User was deleted successfully.' },
                };
            case 'Admin':
                const admin = await Admin.findById(userId);
                if (!admin) {
                    return errors['A407'];
                }
                await Admin.deleteOne({ _id: userId });
                return {
                    status: 200,
                    data: { message: 'Admin was deleted successfully..' },
                };
            case 'Customer':
                const customer = await Customer.findById(userId);
                if (!customer) {
                    return errors['C406'];
                }
                // TO-DO: Add further logic to delete orders, and whatever else is needed when deleting a customer
                await Customer.deleteOne({ _id: userId });
                return {
                    status: 200,
                    data: { message: 'Customer was deleted successfully..' },
                };
            default:
                return errors['U407'];
        }
    } catch (e) {
        return {
            status: 500,
            errorCode: 'U500',
            errorDescription: 'Unexpected error occurred in deleteUserFromMongo.',
        };
    }
};


