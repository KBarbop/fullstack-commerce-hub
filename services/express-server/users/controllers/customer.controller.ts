import { Request, Response } from 'express';
import {
    authorizeUser,
    authorizeUserOrAdmin, generateToken,
    sendResponse,
} from '../../utils';
import {createCustomer, updateCustomer} from "../../../mongo-service";
import {errorHandler} from "../../utils/response.utils";
import {errors} from "../../../shared";

export const signUpCustomer = async (req: Request, res: Response) => {
    try {
        const { username, firstName, lastName, email, password, phoneNumber } = req.body;
        if (!username || !firstName || !lastName || !email || !password || !phoneNumber) {
            await sendResponse({
                res,
                ...errors['C401'],
            });
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            await sendResponse({
                res,
                ...errors['C403'],
            });
            return;
        }
        const createdCustomer = await createCustomer(username, firstName, lastName, email, password, phoneNumber);
        const token = generateToken(createdCustomer.data.customer._id);
        res.cookie('commerce_hub_token', token, {
            httpOnly: false,
            maxAge: 3600000,
        });
        await sendResponse({
            res,
            status: createdCustomer.status,
            errorCode: createdCustomer.errorCode,
            errorDescription: createdCustomer.errorDescription,
            data: createdCustomer.data,
        });
        return;
    } catch (err) {
        await errorHandler(err, res, 'signUpCustomer');
        return;
    }
};

export const editVerificationStatus = async (req: Request, res: Response) => {
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
        const authorization = await authorizeUserOrAdmin(userId, token);
        if( authorization.status !== 200 ) {
            await sendResponse({
                res,
                status: 400,
                errorCode: authorization.errorCode,
                errorDescription: authorization.errorDescription,
            });
            return;
        }
        const { isVerified } = req.body;
        if (isVerified === undefined || isVerified === null) {
            await sendResponse({
                res,
                ...errors['C408'],
            });
            return;
        }
        const updatedCustomer = await updateCustomer(userId, {$set: {isVerified}});
        await sendResponse({
            res,
            status: updatedCustomer.status,
            errorCode: updatedCustomer.errorCode,
            errorDescription: updatedCustomer.errorDescription,
            data: updatedCustomer.data,
        });
        return;
    } catch (err) {
        await errorHandler(err, res, 'editVerificationStatus');
    }
};

export const editPhoneNumber = async (req: Request, res: Response) => {
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
        const authorization = await authorizeUserOrAdmin(userId, token);
        if( authorization.status !== 200 ) {
            await sendResponse({
                res,
                status: 400,
                errorCode: authorization.errorCode,
                errorDescription: authorization.errorDescription,
            });
            return;
        }
        const { phoneNumber } = req.body;
        if (phoneNumber === undefined || phoneNumber === null) {
            await sendResponse({
                res,
                ...errors['C408'],
            });
            return;
        }
        const updatedCustomer = await updateCustomer(userId, {$set: {phoneNumber}});
        await sendResponse({
            res,
            status: updatedCustomer.status,
            errorCode: updatedCustomer.errorCode,
            errorDescription: updatedCustomer.errorDescription,
            data: updatedCustomer.data,
        });
        return;
    } catch (err) {
        await errorHandler(err, res, 'editPhoneNumber');
    }
};

export const editActiveStatus = async (req: Request, res: Response) => {
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
        const authorization = await authorizeUserOrAdmin(userId, token);
        if( authorization.status !== 200 ) {
            await sendResponse({
                res,
                status: 400,
                errorCode: authorization.errorCode,
                errorDescription: authorization.errorDescription,
            });
            return;
        }
        const { isDeactivated } = req.body;
        if (isDeactivated === undefined || isDeactivated === null) {
            await sendResponse({
                res,
                ...errors['C409'],
            });
            return;
        }
        const updatedCustomer = await updateCustomer(userId, {$set: {isDeactivated}});
        await sendResponse({
            res,
            status: updatedCustomer.status,
            errorCode: updatedCustomer.errorCode,
            errorDescription: updatedCustomer.errorDescription,
            data: updatedCustomer.data,
        });
        return;
    } catch (err) {
        await errorHandler(err, res, 'editVerificationStatus');
    }
};

export const updateCustomerPaymentInfo = async (req: Request, res: Response) => {
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
        const authorization = await authorizeUserOrAdmin(userId, token);
        if (authorization.status !== 200) {
            await sendResponse({
                res,
                status: 400,
                errorCode: authorization.errorCode,
                errorDescription: authorization.errorDescription,
            });
            return;
        }
        const { paymentInfo } = req.body;
        if (!paymentInfo) {
            await sendResponse({
                res,
                ...errors['C419'],
            });
            return;
        }
        if (!paymentInfo.cardNumber || !paymentInfo.cardHolder || !paymentInfo.cvc) {
            await sendResponse({
                res,
                ...errors['C420'],
            });
            return;
        }

        const cardNumberRegex = /^\d{16}$/;
        if (!cardNumberRegex.test(paymentInfo.cardNumber)) {
            await sendResponse({
                res,
                ...errors['C410'],
            });
            return;
        }

        const cardHolderRegex = /^[a-zA-Z\s]+$/;
        if (!cardHolderRegex.test(paymentInfo.cardHolder)) {
            await sendResponse({
                res,
                ...errors['C411'],
            });
            return;
        }

        const cvcRegex = /^\d{3}$/;
        if (!cvcRegex.test(paymentInfo.cvc)) {
            await sendResponse({
                res,
                ...errors['C412'],
            });
            return;
        }

        const updatedCustomer = await updateCustomer(userId, { $set: { paymentInfo } });
        await sendResponse({
            res,
            status: updatedCustomer.status,
            errorCode: updatedCustomer.errorCode,
            errorDescription: updatedCustomer.errorDescription,
            data: updatedCustomer.data,
        });
        return;
    } catch (err) {
        await errorHandler(err, res, 'updateCustomerPaymentInfo');
    }
};

export const addCustomerAddress = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.commerce_hub_token;
        const customerId = req.params.customerId;
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
                status: 400,
                errorCode: authorization.errorCode,
                errorDescription: authorization.errorDescription,
            });
            return;
        }
        const { address } = req.body;
        if (!address) {
            await sendResponse({
                res,
                ...errors['C413'],
            });
            return;
        }
        if (!address.street || !address.streetNumber || !address.zipCode || !address.city || !address.bellName) {
            await sendResponse({
                res,
                ...errors['C409'],
            });
            return;
        }

        const { street, streetNumber, zipCode, city, bellName, fullAddress } = address;

        // const streetRegex = /^[a-zA-Z\s]+$/;
        // const streetNumberRegex = /^[a-zA-Z0-9\s]+$/;
        // const zipCodeRegex = /^\d{5}$/;
        // const cityRegex = /^[a-zA-Z\s]+$/;
        // const bellNameRegex = /^[a-zA-Z\s]+$/;
        //
        // if (!streetRegex.test(street)) {
        //     await sendResponse({
        //         res,
        //         ...errors['C414'],
        //     });
        //     return;
        // }
        //
        // if (!streetNumberRegex.test(streetNumber)) {
        //     await sendResponse({
        //         res,
        //         ...errors['C415'],
        //     });
        //     return;
        // }
        //
        // if (!zipCodeRegex.test(zipCode)) {
        //     await sendResponse({
        //         res,
        //         ...errors['C416'],
        //     });
        //     return;
        // }
        //
        // if (!cityRegex.test(city)) {
        //     await sendResponse({
        //         res,
        //         ...errors['C417'],
        //     });
        //     return;
        // }
        //
        // if (!bellNameRegex.test(bellName)) {
        //     await sendResponse({
        //         res,
        //         ...errors['C418'],
        //     });
        //     return;
        // }
        const updatedCustomer = await updateCustomer(customerId, {$push: {addresses: address}});
        await sendResponse({
            res,
            status: updatedCustomer.status,
            errorCode: updatedCustomer.errorCode,
            errorDescription: updatedCustomer.errorDescription,
            data: updatedCustomer.data,
        });
        return;
    } catch (err) {
        await errorHandler(err, res, 'addCustomerAddress');
    }
};

export const removeCustomerAddress = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.commerce_hub_token;
        const customerId = req.params.customerId;
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
                status: 400,
                errorCode: authorization.errorCode,
                errorDescription: authorization.errorDescription,
            });
            return;
        }
        const { address } = req.body;
        console.log(address);
        if (!address) {
            await sendResponse({
                res,
                ...errors['C413'],
            });
            return;
        }

        const updatedCustomer = await updateCustomer(customerId, {
            $pull: { addresses: { fullAddress: address } }, // Make sure to use the correct spelling
        });

        await sendResponse({
            res,
            status: updatedCustomer.status,
            errorCode: updatedCustomer.errorCode,
            errorDescription: updatedCustomer.errorDescription,
            data: updatedCustomer.data,
        });
        return;
    } catch (err) {
        await errorHandler(err, res, 'removeCustomerAddress');
    }
};
