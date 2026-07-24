import { Request, Response } from 'express';
import {
    authorizeAdmin,
    sendResponse,
} from '../../utils';
import {errorHandler} from "../../utils/response.utils";
import {createAdmin, updateAdminRole} from "../../../mongo-service";
import {errors} from "../../../shared";

export const signUpAdmin = async (req: Request, res: Response) => {
    try {
        const { username, firstName, lastName, email, password, role } = req.body;
        if (!username || !firstName || !lastName || !email || !password || !role) {
            await sendResponse({
                res,
                ...errors['A401'],
            });
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            await sendResponse({
                res,
                ...errors['A403'],
            });
            return;
        }
        if (role === 'owner' || role === 'admin') {
            const createdAdmin = await createAdmin(username, firstName, lastName, email, password, role);
            await sendResponse({
                res,
                status: createdAdmin.status,
                errorCode: createdAdmin.errorCode,
                errorDescription: createdAdmin.errorDescription,
                data: createdAdmin.data,
            });
            return;
        } else {
            await sendResponse({
                res,
                ...errors['A405'],
            });
            return;
        }
    } catch (err) {
        await errorHandler(err, res, 'signUpAdmin');
        return;
    }
};

export const editAdminRole = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.commerce_hub_token;
        const userId = req.params.userId;
        if (!token) {
            await sendResponse({
                res,
                ...errors['U411'],
            });
            return;
        }
        const authorization = await authorizeAdmin(userId, token);
        if( authorization.status !== 200 ) {
            await sendResponse({
                res,
                status: 400,
                errorCode: authorization.errorCode,
                errorDescription: authorization.errorDescription,
            });
            return;
        }
        const { role } = req.body;
        if (!role) {
            await sendResponse({
                res,
                ...errors['A409'],
            });
            return;
        }
        if ( role === 'owner' || role === 'admin') {
            const updatedAdmin = await updateAdminRole(userId, role);
            await sendResponse({
                res,
                status: updatedAdmin.status,
                errorCode: updatedAdmin.errorCode,
                errorDescription: updatedAdmin.errorDescription,
                data: updatedAdmin.data,
            });
            return;
        } else {
            await sendResponse({
                res,
                ...errors['A405'],
            });
            return;
        }
    } catch (err) {
        await errorHandler(err, res, 'deleteUser');
    }
};

