import {Request, Response} from "express";
import {authorizeAdminRole, sendResponse} from "../utils";
import {errors} from "../../shared";
import {
    createCategory,
    deleteCategoryFromMongo,
    deleteProductFromMongo,
    retrieveCategories,
    updateCategory
} from "../../mongo-service";
import {errorHandler} from "../utils/response.utils";

export const createNewCategory = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.commerce_hub_token;
        if (!token) {
            await sendResponse({
                res,
                ...errors['U411'],
            });
            return;
        }
        const authorization = await authorizeAdminRole(token);
        if( authorization.status !== 200 ) {
            await sendResponse({
                res,
                status: 400,
                errorCode: authorization.errorCode,
                errorDescription: authorization.errorDescription,
            });
            return;
        }
        const { title_en, title_el, description_en, description_el, image } = req.body;
        if (!title_en || !title_el) {
            await sendResponse({
                res,
                ...errors['CA401'],
            });
            return;
        }
        const createdCategory = await createCategory(title_en, title_el, description_en, description_el, image);
        await sendResponse({
            res,
            ...createdCategory
        });
        return;
    } catch (err) {
        await errorHandler(err, res, 'createNewCategory');
        return;
    }
};

// TO-DO: Update image endpoint
export const editCategory = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.commerce_hub_token;
        if (!token) {
            await sendResponse({
                res,
                ...errors['U411'],
            });
            return;
        }
        const authorization = await authorizeAdminRole(token);
        if( authorization.status !== 200 ) {
            await sendResponse({
                res,
                status: 400,
                errorCode: authorization.errorCode,
                errorDescription: authorization.errorDescription,
            });
            return;
        }
        const { title, description } = req.body;
        const categoryId = req.params.categoryId;
        const updatedCategory = await updateCategory(categoryId, {$set: {title, description}});
        await sendResponse({
            res,
            ...updatedCategory
        });
        return;
    } catch (err) {
        await errorHandler(err, res, 'editCategory');
        return;
    }
};

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await retrieveCategories({});
        await sendResponse({
            res,
            ...categories
        });
        return;
    } catch (err) {
        await errorHandler(err, res, 'getAllCategories');
        return;
    }
};

export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const categoryId = req.params.categoryId;
        const category = await retrieveCategories({_id: categoryId});
        await sendResponse({
            res,
            ...category
        });
        return;
    } catch (err) {
        await errorHandler(err, res, 'getCategoryById');
        return;
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.commerce_hub_token;
        if (!token) {
            await sendResponse({
                res,
                ...errors['U411'],
            });
            return;
        }
        const authorization = await authorizeAdminRole(token);
        if( authorization.status !== 200 ) {
            await sendResponse({
                res,
                status: 400,
                errorCode: authorization.errorCode,
                errorDescription: authorization.errorDescription,
            });
            return;
        }
        const categoryId = req.params.categoryId;
        // TO-DO: Delete products upon category deletion
        const deletedCategory = await deleteCategoryFromMongo(categoryId);
        await sendResponse({
            res,
            ...deletedCategory
        });
        return;
    } catch (err) {
        await errorHandler(err, res, 'deleteCategory');
        return;
    }
};
