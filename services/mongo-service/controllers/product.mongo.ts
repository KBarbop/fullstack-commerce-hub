    import {IMongoResponse, IProduct} from "../../../shared";
    import {errors} from "../../shared";
    import {FilterQuery, UpdateQuery, UpdateWithAggregationPipeline} from "mongoose";
    import {Product} from "../models/product.model";

    const defaultFieldsReturned = 'category title_en title_el description_en description_el ingredients_en ingredients_el options_en options_el price image';

    export const createProduct = async (
        category: string,
        title_en: string,
        title_el: string,
        description_en: string,
        description_el: string,
        ingredients_en: string[],
        ingredients_el: string[],
        options_en: string[],
        options_el: string[],
        price: string,
        image: string,
    ): Promise<IMongoResponse> => {
        try {
            const newProduct = new Product({category, title_en, title_el, description_en, description_el, ingredients_en, ingredients_el, options_en, options_el, price, image});
            const savedProduct = await newProduct.save();
            if (!savedProduct) {
                return errors['P501'];
            }
            const productToReturn = await Product.findById(
                savedProduct.id,
            ).select(defaultFieldsReturned);
            if (!productToReturn) {
                return errors['P404'];
            }

            return {
                status: 200,
                data: {
                    product: productToReturn,
                },
            };
        } catch (e: any) {
            console.error(e);

            if (e.code === 11000 && e.keyValue) {
                const keyValue: Record<string, any> = e.keyValue;
                return {
                    status: 400,
                    errorCode: 'P400',
                    errorDescription: `Duplicate key error. Field '${Object.keys(keyValue)[0]}' with value '${keyValue[Object.keys(keyValue)[0]]}' already exists.`,
                };
            } else {
                return {
                    status: 500,
                    errorCode: 'P500',
                    errorDescription: 'Unexpected error occurred in createProduct.',
                };
            }
        }
    }

    export const retrieveProducts = async (filter: FilterQuery<IProduct>): Promise<IMongoResponse> => {
        try {
            const products = await Product.find(filter).select(defaultFieldsReturned);
            if (!products) {
                return errors['P404'];
            }
            return {
                status: 200,
                data: { products },
            };
        } catch (e) {
            console.error(e);
            return {
                status: 500,
                errorCode: 'P500',
                errorDescription: 'Unexpected error occurred in retrieveProducts.',
            };
        }
    };

    // TO-DO: Update Image Endpoint

    export const updateProduct = async (productId: string, updateQuery: UpdateQuery<IProduct> | UpdateWithAggregationPipeline): Promise<IMongoResponse> => {
        try {
            const updatedProduct = await Product.updateOne(
                { _id: productId },
                updateQuery
            );
            if (!updatedProduct) {
                return errors['P502'];
            }
            const productToReturn = await Product.findById(productId).select(defaultFieldsReturned);
            if (!productToReturn) {
                return errors['P404'];
            }
            return {
                status: 200,
                data: { updatedProduct:  productToReturn},
            };
        } catch (e: any) {
            console.error(e);

            if (e.code === 11000 && e.keyValue) {
                const keyValue: Record<string, any> = e.keyValue;
                return {
                    status: 400,
                    errorCode: 'P400',
                    errorDescription: `Duplicate key error. Field '${Object.keys(keyValue)[0]}' with value '${keyValue[Object.keys(keyValue)[0]]}' already exists.`,
                };
            } else {
                return {
                    status: 500,
                    errorCode: 'P500',
                    errorDescription: 'Unexpected error occurred in updateProduct.',
                };
            }
        }
    }

    export const deleteProductFromMongo = async (productId: string):Promise<IMongoResponse> => {
        try {
            await Product.deleteOne({_id: productId});
            return {
                status: 200,
                data: { message: 'Product was deleted successfully.' },
            };
        } catch (e) {
            return {
                status: 500,
                errorCode: 'P500',
                errorDescription: 'Unexpected error occurred in deleteProductFromMongo.',
            };
        }
    }
