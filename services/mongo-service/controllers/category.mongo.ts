import {ICategory, ICustomer, IMongoResponse} from "../../../shared";
import {errors} from "../../shared";
import {Category} from "../models/category.model";
import {FilterQuery, UpdateQuery, UpdateWithAggregationPipeline} from "mongoose";
import {Customer} from "../models/customer.model";

const defaultFieldsReturned = 'title_en title_el description_en description_el image';

export const createCategory = async (title_en: string, title_el: string, description_en: string, description_el: string, image: string): Promise<IMongoResponse> => {
    try {
       const newCategory = new Category({title_en, title_el, description_en, description_el, image});
       const savedCategory = await newCategory.save();
       if (!savedCategory) {
           return errors['CA501'];
       }
        const categoryToReturn = await Category.findById(
            savedCategory.id,
        ).select(defaultFieldsReturned);
        if (!categoryToReturn) {
            return errors['CA404'];
        }

        return {
            status: 200,
            data: {
                category: categoryToReturn,
            },
        };
    } catch (e: any) {
        console.error(e);

        if (e.code === 11000 && e.keyValue) {
            const keyValue: Record<string, any> = e.keyValue;
            return {
                status: 400,
                errorCode: 'CA400',
                errorDescription: `Duplicate key error. Field '${Object.keys(keyValue)[0]}' with value '${keyValue[Object.keys(keyValue)[0]]}' already exists.`,
            };
        } else {
            return {
                status: 500,
                errorCode: 'CA500',
                errorDescription: 'Unexpected error occurred in createCategory.',
            };
        }
    }
}

export const retrieveCategories = async (filter: FilterQuery<ICategory>): Promise<IMongoResponse> => {
    try {
        const categories = await Category.find(filter).select(defaultFieldsReturned);
        if (!categories) {
            return errors['CA404'];
        }
        return {
            status: 200,
            data: { categories },
        };
    } catch (e) {
        return {
            status: 500,
            errorCode: 'CA500',
            errorDescription: 'Unexpected error occurred in retrieveCategories.',
        };
    }
};

// TO-DO: Update Image Endpoint

export const updateCategory = async (categoryId: string, updateQuery: UpdateQuery<ICustomer> | UpdateWithAggregationPipeline): Promise<IMongoResponse> => {
    try {
        const updatedCategory = await Category.updateOne(
            { _id: categoryId },
            updateQuery
        );
        if (!updatedCategory) {
            return errors['CA502'];
        }
        const categoryToReturn = await Category.findById(categoryId).select(defaultFieldsReturned);
        if (!categoryToReturn) {
            return errors['CA404'];
        }
        return {
            status: 200,
            data: { updatedCategory:  categoryToReturn},
        };
    } catch (e: any) {
        console.error(e);

        if (e.code === 11000 && e.keyValue) {
            const keyValue: Record<string, any> = e.keyValue;
            return {
                status: 400,
                errorCode: 'CA400',
                errorDescription: `Duplicate key error. Field '${Object.keys(keyValue)[0]}' with value '${keyValue[Object.keys(keyValue)[0]]}' already exists.`,
            };
        } else {
            return {
                status: 500,
                errorCode: 'CA500',
                errorDescription: 'Unexpected error occurred in updateCategory.',
            };
        }
    }
}

export const deleteCategoryFromMongo = async (categoryId: string):Promise<IMongoResponse> => {
    try {
        await Category.deleteOne({_id: categoryId});
        return {
            status: 200,
            data: { message: 'Category was deleted successfully.' },
        };
    } catch (e) {
        return {
            status: 500,
            errorCode: 'CA500',
            errorDescription: 'Unexpected error occurred in deleteCategoryFromMongo.',
        };
    }
}
