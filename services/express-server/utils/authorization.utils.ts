import jwt from "jsonwebtoken";
import {Admin} from "../../mongo-service/models/admin.model";
import {IAdmin, IMongoResponse, IUser} from "../../../shared";
import {User} from "../../mongo-service/models/user.model";
import {errors} from "../../shared";

export const authorizeUserOrAdmin = async (userId: string, token: string): Promise<IMongoResponse> => {
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || '');
        const userSessionId = (decodedToken as jwt.JwtPayload).id;
        if (userId !== userSessionId) {
            const admin = await Admin.findById(userSessionId);
            if (!admin) {
                return {
                    status: 400,
                    errorCode: 'U412',
                    errorDescription: 'Unauthorized User. User is not an admin or the owner of the account.',
                };
            } else {
                return {
                    status: 200,
                    data: {
                        message: "User is authorized."
                    }
                };
            }
        }
        return {
            status: 200,
            data: {
                message: "User is authorized."
            }
        };

    } catch (e) {
        console.error(e);
        return {
            status: 500,
            errorCode: 'A500',
            errorDescription: 'Unexpected error occurred in authorizeUserOrAdmin.',
        };
    }
}

export const authorizeAdmin = async (userId: string, token: string): Promise<IMongoResponse> => {
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || '');
        const userSessionId = (decodedToken as jwt.JwtPayload).id;
        const admin = await Admin.findById(userSessionId) as IAdmin;
        if (!admin) {
            return {
                status: 404,
                errorCode: 'U413',
                errorDescription: 'Unauthorized User. User is not an admin.',
            };
        } else {
            if (admin.role !== 'admin') {
                return {
                    status: 400,
                    errorCode: 'A410',
                    errorDescription: 'Unauthorized User. User does not have admin role.',
                };
            }
            return {
                status: 200,
                data: {
                    message: "User is authorized."
                }
            };
        }

    } catch (e) {
        console.error(e);
        return {
            status: 500,
            errorCode: 'A500',
            errorDescription: 'Unexpected error occurred in authorizeAdmin.',
        };
    }
}

export const authorizeAdminRole = async (token: string): Promise<IMongoResponse> => {
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || '');
        const userSessionId = (decodedToken as jwt.JwtPayload).id;
        const admin = await User.findById(userSessionId) as IUser;
        if (!admin) {
            return {
                status: 404,
                errorCode: 'U413',
                errorDescription: 'Unauthorized User. User is not an admin.',
            };
        } else {
            if (admin.__t !== 'Admin') {
                return {
                    status: 400,
                    errorCode: 'U413',
                    errorDescription: 'Unauthorized User. User does not have admin role.',
                };
            }
            return {
                status: 200,
                data: {
                    message: "User is authorized."
                }
            };
        }

    } catch (e) {
        console.error(e);
        return {
            status: 500,
            errorCode: 'A500',
            errorDescription: 'Unexpected error occurred in authorizeAdminRole.',
        };
    }
}

export const authorizeUser = async (token: string): Promise<IMongoResponse> => {
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || '');
        const userSessionId = (decodedToken as jwt.JwtPayload).id;
        const user = await User.findById(userSessionId);
        if (!user) {
            return errors['U414'];
        }
        return {
            status: 200,
            data: {
                message: "User is authorized."
            }
        };

    } catch (e) {
        console.error(e);
        return {
            status: 500,
            errorCode: 'A500',
            errorDescription: 'Unexpected error occurred in authorizeUser.',
        };
    }
}