import {IMongoResponse, IUser} from "../../../shared";
import {Admin} from "../models/admin.model";
import {FilterQuery} from "mongoose";
import {User} from "../models/user.model";
import {errors} from "../../shared";

const defaultFieldsReturned = 'username email firstName lastName role';

export const createAdmin = async (
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: string,
): Promise<IMongoResponse> => {
    try {
        const newAdmin = new Admin({
            username,
            firstName,
            lastName,
            email,
            password,
            role,
        });

        const savedAdmin = await newAdmin.save();
        if (!savedAdmin) {
            return errors['A501'];
        }

        const adminToReturn = await Admin.findById(
            savedAdmin.id,
        ).select(defaultFieldsReturned);
        if (!adminToReturn) {
            return errors['A407'];
        }

        return {
            status: 200,
            data: {
                admin: adminToReturn,
            },
        };
    } catch (e: any) {
        console.error(e);

        if (e.code === 11000 && e.keyValue) {
            const keyValue: Record<string, any> = e.keyValue;
            return {
                status: 400,
                errorCode: 'A404',
                errorDescription: `Duplicate key error. Field '${Object.keys(keyValue)[0]}' with value '${keyValue[Object.keys(keyValue)[0]]}' already exists.`,
            };
        } else {
            return {
                status: 500,
                errorCode: 'A500',
                errorDescription: 'Unexpected error occurred in createAdmin.',
            };
        }
    }
};

export const retrieveAdmins = async (filter: FilterQuery<IUser>): Promise<IMongoResponse> => {
    try {
        const admins = await Admin.find(filter).select(defaultFieldsReturned);
        if (!admins) {
            return errors['A406'];
        }
        return {
            status: 200,
            data: { users: admins },
        };
    } catch (e) {
        console.error(e);
        return {
            status: 500,
            errorCode: 'A500',
            errorDescription: 'Unexpected error occurred in retrieveAdmins.',
        };
    }
};

export const updateAdminRole = async (adminId: string, role: string): Promise<IMongoResponse> => {
    try {
        const updatedAdmin = await Admin.updateOne(
            { _id: adminId },
            {role}
        );
        if (!updatedAdmin) {
            return errors['A502'];
        }
        const adminToReturn = await Admin.findById(adminId).select(defaultFieldsReturned);
        if (!adminToReturn) {
            return errors['A407'];
        }
        return {
            status: 200,
            data: { updatedAdmin:  adminToReturn},
        };
    } catch (e) {
        console.error(e);
        return {
            status: 500,
            errorCode: 'A500',
            errorDescription: 'Unexpected error occurred in updateAdminRole.',
        };
    }
}