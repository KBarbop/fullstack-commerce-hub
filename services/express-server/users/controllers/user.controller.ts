import { Request, Response } from 'express';
import {
    authenticateUser,
    retrieveUser,
    retireveUsers,
    retrieveAdmins,
    retrieveCustomers,
    deleteUserFromMongo,
    updateCustomer,
    updateUser
} from "../../../mongo-service";
import {authorizeUser, authorizeUserOrAdmin, generateToken, sendResponse} from "../../utils";
import {errorHandler} from "../../utils/response.utils";
import {errors} from "../../../shared";
import jwt from "jsonwebtoken";
import {User} from "../../../mongo-service/models/user.model";
import {IUser} from "../../../../shared";

export const logInUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const authorizedUser = await authenticateUser(email, password);
        if (authorizedUser.status === 200) {
            const token = generateToken(authorizedUser.data.user._id);
            res.cookie('commerce_hub_token', token, {
                httpOnly: false,
                maxAge: 3600000,
            });
            const user = authorizedUser.data?.user;

            switch (user.__t) {
                case 'Customer':
                    const customer = await retrieveCustomers({_id: user._id});
                    await sendResponse({
                        res,
                        status: authorizedUser.status,
                        data: {
                            user: customer.data?.users[0],
                        },
                    });
                    return;
                default:
                    await sendResponse({
                        res,
                        status: authorizedUser.status,
                        data: {
                            user: authorizedUser.data?.user,
                        },
                    });
                    return;

            }
        } else {
            await sendResponse({
                res,
                status: authorizedUser.status,
                errorCode: authorizedUser.errorCode,
                errorDescription: authorizedUser.errorDescription,
            });
            return;
        }
    } catch (err) {
        await errorHandler(err, res, 'logInUser');
        return;
    }
};

export const logOutUser = async (req: Request, res: Response) => {
    try {
        res.clearCookie('commerce_hub_token', {
            path: '/',
        });

        await sendResponse({
            res,
            status: 200,
            data: {
                message: 'Logged out successfully.',
            },
        });
        return;
    } catch (err) {
        await errorHandler(err, res, 'logOutUser');
        return;
    }
};


export const getUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const user = await retrieveUser({_id: userId});
        await sendResponse({
            res,
            status: user.status,
            data: user.data,
            errorCode: user.errorCode,
            errorDescription: user.errorDescription,
        });
        return;
    } catch (err) {
        await errorHandler(err, res, 'getUser');
        return;
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await retireveUsers({});
        await sendResponse({
            res,
            status: users.status,
            data: users.data,
            errorCode: users.errorCode,
            errorDescription: users.errorDescription,
        });
        return;
    } catch (err) {
        await errorHandler(err, res, 'getAllUsers');
        return;
    }
};

export const getUsersByType = async (req: Request, res: Response) => {
    try {
        const { role } = req.body;
        if (!role) {
            await sendResponse({
                res,
                ...errors['U408'],
            });
            return;
        }
        switch(role) {
            case 'owner':
            case 'admin':
                const admins = await retrieveAdmins({role});
                await sendResponse({
                    res,
                    status: admins.status,
                    data: admins.data,
                    errorCode: admins.errorCode,
                    errorDescription: admins.errorDescription,
                });
                return;
            case 'customer':
                const customers = await retrieveCustomers({});
                await sendResponse({
                    res,
                    status: customers.status,
                    data: customers.data,
                    errorCode: customers.errorCode,
                    errorDescription: customers.errorDescription,
                });
                return;
            default:
                await sendResponse({
                    res,
                    ...errors['U407'],
                });
                return;
        }
    } catch (err) {
        await errorHandler(err, res, 'getUsersByType');
        return;
    }
};

export const editUserData = async (req: Request, res: Response) => {
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
        const { username, firstName, lastName } = req.body;
        if (!username || !firstName || !lastName) {
            await sendResponse({
                res,
                ...errors['U409'],
            });
            return;
        }
        const updatedUser = await updateUser(userId, {$set: {username, firstName, lastName}});
        await sendResponse({
            res,
            status: updatedUser.status,
            data: updatedUser.data,
            errorCode: updatedUser.errorCode,
            errorDescription: updatedUser.errorDescription,
        });
        return;
    } catch (err) {
        await errorHandler(err, res, 'editUserData');
        return;
    }
};

export const getMe = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.commerce_hub_token;
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
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || '');
        const userSessionId = (decodedToken as jwt.JwtPayload).id;
        const user = await User.findById(userSessionId) as IUser;
        if (!user) {
            return errors['U414'];
        }
        switch(user.__t) {
            case 'Owner':
            case 'Admin':
                const admins = await retrieveAdmins({_id: user._id});
                await sendResponse({
                    res,
                    status: admins.status,
                    data: admins.data,
                    errorCode: admins.errorCode,
                    errorDescription: admins.errorDescription,
                });
                return;
            case 'Customer':
                const customers = await retrieveCustomers({_id: user._id});
                await sendResponse({
                    res,
                    status: customers.status,
                    data: customers.data,
                    errorCode: customers.errorCode,
                    errorDescription: customers.errorDescription,
                });
                return;
            default:
                await sendResponse({
                    res,
                    ...errors['U407'],
                });
                return;
        }
    } catch (err) {
        await errorHandler(err, res, 'getMe');
        return;
    }
};


export const updateUserEmail = async (req: Request, res: Response) => {
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
        const { newEmail, oldEmail, password } = req.body;
        if (!oldEmail || !password) {
            await sendResponse({
                res,
                ...errors['U401'],
            });
            return;
        }
        const authorizedUser = await authenticateUser(oldEmail, password);
        if (authorizedUser.status === 200) {
            const mongoUser = await retrieveUser({_id: userId});
            if (mongoUser.status !== 200) {
                await sendResponse({
                    res,
                    ...errors['U404'],
                });
                return;
            }
            const user = mongoUser.data.user;
            if (user.email === newEmail) {
                await sendResponse({
                    res,
                    ...errors['U415'],
                });
                return;
            }
            switch(user.__t) {
                case 'Customer':
                    const updatedCustomer = await updateCustomer(userId, {$set: {email: newEmail, isVerified: false}});
                    await sendResponse({
                        res,
                        status: updatedCustomer.status,
                        errorCode: updatedCustomer.errorCode,
                        errorDescription: updatedCustomer.errorDescription,
                        data: updatedCustomer.data,
                    });
                    return;
                case 'Admin':
                case 'User':
                    const updatedUser = await updateUser(userId, {$set: {email: newEmail}});
                    await sendResponse({
                        res,
                        status: updatedUser.status,
                        errorCode: updatedUser.errorCode,
                        errorDescription: updatedUser.errorDescription,
                        data: updatedUser.data,
                    });
                    return;
                default:
                    await sendResponse({
                        res,
                        ...errors['U407'],
                    });
                    return;
            }
        } else {
            await sendResponse({
                res,
                status: 400,
                errorCode: 'U4O3',
                errorDescription: 'Incorrect Password.',
            });
            return;
        }
    } catch (err) {
        await errorHandler(err, res, 'updateUserEmail');
        return;
    }
};

export const deleteUser = async (req: Request, res: Response) => {
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
        const deletedUser = await deleteUserFromMongo(userId);
        await sendResponse({
            res,
            status: deletedUser.status,
            data: deletedUser.data,
            errorCode: deletedUser.errorCode,
            errorDescription: deletedUser.errorDescription,
        });
        return;
    } catch (err) {
        await errorHandler(err, res, 'deleteUser');
        return;
    }
};

export const authorizeUserSession = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.commerce_hub_token;
        if (!token) {
            await sendResponse({
                res,
                ...errors['U411'],
            });
            return;
        }
        await sendResponse({
            res,
            status: 200,
            data: {
                message: 'User session authorizes successfully.',
            },
        });
        return;
    } catch (err) {
        await errorHandler(err, res, 'authorizeUserSession');
        return;
    }
};