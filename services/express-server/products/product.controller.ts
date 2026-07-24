import { Request, Response } from 'express';
import multer from 'multer';
import { authorizeAdminRole, sendResponse } from '../utils';
import { errors } from '../../shared';
import { errorHandler } from '../utils/response.utils';
import { createProduct, deleteProductFromMongo, retrieveProducts, updateProduct } from '../../mongo-service';

import {deleteImageFromS3, uploadImageToS3} from '../../upload-service/upload.service'; // Adjust the path as necessary


const storage = multer.memoryStorage();
const upload = multer({ storage });

export const createNewProduct = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.commerce_hub_token;
        if (!token) {
            console.log('Token not found');
            await sendResponse({
                res,
                ...errors['U411'],
            });
            return;
        }

        const authorization = await authorizeAdminRole(token);
        if (authorization.status !== 200) {
            console.log('Authorization failed:', authorization);
            await sendResponse({
                res,
                status: 400,
                errorCode: authorization.errorCode,
                errorDescription: authorization.errorDescription,
            });
            return;
        }

        upload.single('image')(req, res, async (err: any) => {
            if (err) {
                console.log('Multer error:', err);
                await sendResponse({
                    res,
                    ...errors['P401'],
                });
                return;
            }

            console.log('Multer upload completed');
            const { category, title_en, title_el, description_en, description_el, ingredients_en, ingredients_el, options_en, options_el, price } = req.body;
            const image = (req as any).file;

            if (!category || !price || !image) {
                console.log('Missing required fields');
                await sendResponse({
                    res,
                    ...errors['P401'],
                });
                return;
            }

            let parsedIngredientsEn = [];
            let parsedOptionsEn = [];
            let parsedIngredientsEl = [];
            let parsedOptionsEl = [];

            // Handle undefined ingredients and options
            try {
                parsedIngredientsEn = ingredients_en ? JSON.parse(ingredients_en) : [];
                parsedOptionsEn = options_en ? JSON.parse(options_en) : [];
                parsedIngredientsEl = ingredients_el ? JSON.parse(ingredients_el) : [];
                parsedOptionsEl = options_el ? JSON.parse(options_el) : [];

                // Ensure they are arrays
                if (!Array.isArray(parsedIngredientsEn) || !Array.isArray(parsedOptionsEn) || !Array.isArray(parsedIngredientsEl) || !Array.isArray(parsedOptionsEl)) {
                    throw new Error('Ingredients and options should be arrays');
                }
            } catch (parseError) {
                console.error('Error parsing ingredients or options:', parseError);
                // Set to empty arrays in case of parsing error
                parsedIngredientsEn = [];
                parsedOptionsEn = [];
                parsedIngredientsEl = [];
                parsedOptionsEl = [];
            }

            try {
                console.log('Uploading image to S3...');
                const imageUrl = await uploadImageToS3(image);
                console.log('Image uploaded successfully, URL:', imageUrl);

                const createdProduct = await createProduct(category, title_en, title_el, description_en, description_el, parsedIngredientsEn, parsedIngredientsEl, parsedOptionsEn, parsedOptionsEl, price, imageUrl);
                console.log('Product created:', createdProduct);

                await sendResponse({
                    res,
                    ...createdProduct
                });
            } catch (uploadError) {
                console.error('Error during image upload or product creation:', uploadError);
                await sendResponse({
                    res,
                    ...errors['P402'],
                });
            }
        });
    } catch (err) {
        console.error('Error in createNewProduct:', err);
        await errorHandler(err, res, 'createNewProduct');
    }
};



export const editProductData = async (req: Request, res: Response) => {
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
        if (authorization.status !== 200) {
            await sendResponse({
                res,
                status: 400,
                errorCode: authorization.errorCode,
                errorDescription: authorization.errorDescription,
            });
            return;
        }

        const productId = req.params.productId;

        upload.single('image')(req, res, async (err: any) => {
            if (err) {
                console.log('Multer error:', err);
                await sendResponse({
                    res,
                    ...errors['P401'],
                });
                return;
            }

            const { category, title_en, title_el, description_en, description_el, ingredients_en, ingredients_el, options_en, options_el, price } = req.body;
            const image = (req as any).file;

            let parsedIngredientsEn = [];
            let parsedOptionsEn = [];
            let parsedIngredientsEl = [];
            let parsedOptionsEl = [];

            // Handle undefined ingredients and options
            try {
                parsedIngredientsEn = ingredients_en ? JSON.parse(ingredients_en) : [];
                parsedOptionsEn = options_en ? JSON.parse(options_en) : [];
                parsedIngredientsEl = ingredients_el ? JSON.parse(ingredients_el) : [];
                parsedOptionsEl = options_el ? JSON.parse(options_el) : [];

                // Ensure they are arrays
                if (!Array.isArray(parsedIngredientsEn) || !Array.isArray(parsedOptionsEn) || !Array.isArray(parsedIngredientsEl) || !Array.isArray(parsedOptionsEl)) {
                    throw new Error('Ingredients and options should be arrays');
                }
            } catch (parseError) {
                console.error('Error parsing ingredients or options:', parseError);
                // Set to empty arrays in case of parsing error
                parsedIngredientsEn = [];
                parsedOptionsEn = [];
                parsedIngredientsEl = [];
                parsedOptionsEl = [];
            }

            const existingProductResponse = await retrieveProducts({ _id: productId });
            if (existingProductResponse.status !== 200) {
                await sendResponse({
                    res,
                    ...existingProductResponse
                });
                return;
            }

            const existingProduct = existingProductResponse.data.products[0];
            if (!existingProduct) {
                await sendResponse({
                    res,
                    ...errors['P404'],
                });
                return;
            }

            const existingImageKey = existingProduct.image.split('/').pop();
            if (existingImageKey) {
                await deleteImageFromS3(existingImageKey);
            }

            let imageUrl = existingProduct.image;
            if (image) {
                try {
                    console.log('Uploading new image to S3...');
                    imageUrl = await uploadImageToS3(image);
                    console.log('New image uploaded successfully, URL:', imageUrl);
                } catch (uploadError) {
                    console.error('Error during image upload:', uploadError);
                    await sendResponse({
                        res,
                        ...errors['P402'],
                    });
                    return;
                }
            }

            const updateResponse = await updateProduct(productId, {
                $set: {
                    title_en,
                    title_el,
                    description_en,
                    description_el,
                    price,
                    ingredients_en: parsedIngredientsEn,
                    ingredients_el: parsedIngredientsEl,
                    options_en: parsedOptionsEn,
                    options_el: parsedOptionsEl,
                    category,
                    image: imageUrl,
                }
            });

            await sendResponse({
                res,
                ...updateResponse
            });
        });
    } catch (err) {
        await errorHandler(err, res, 'editProductData');
    }
};
export const changeProductCategory = async (req: Request, res: Response) => {
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
        const { category } = req.body;
        if (!category) {
            await sendResponse({
                res,
                ...errors['P402'],
            });
            return;
        }
        const productId = req.params.productId;
        const updatedProduct = await updateProduct(productId, {$set: {category}});
        await sendResponse({
            res,
            ...updatedProduct
        });
        return;
    } catch (err) {
        await errorHandler(err, res, 'changeProductCategory');
        return;
    }
};

export const addIngredients = async (req: Request, res: Response) => {
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
        const { ingredients } = req.body;
        if (!ingredients) {
            await sendResponse({
                res,
                ...errors['P403'],
            });
            return;
        }
        const productId = req.params.productId;
        const updatedProduct = await updateProduct(productId, {$push: {ingredients: {$each: ingredients}}});
        await sendResponse({
            res,
            ...updatedProduct
        });
        return;
    } catch (err) {
        await errorHandler(err, res, 'addIngredients');
        return;
    }
};

export const removeIngredients = async (req: Request, res: Response) => {
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
        const { ingredients } = req.body;
        if (!ingredients) {
            await sendResponse({
                res,
                ...errors['P403'],
            });
            return;
        }
        const productId = req.params.productId;
        const updatedProduct = await updateProduct(productId, {$pull: {ingredients: {$in: ingredients}}});
        await sendResponse({
            res,
            ...updatedProduct
        });
        return;
    } catch (err) {
        await errorHandler(err, res, 'removeIngredients');
        return;
    }
};

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await retrieveProducts({});
        await sendResponse({
            res,
            ...products
        });
        return;
    } catch (err) {
        await errorHandler(err, res, 'getAllProducts');
        return;
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const productId = req.params.productId;
        const product = await retrieveProducts({_id: productId});
        await sendResponse({
            res,
            ...product
        });
        return;
    } catch (err) {
        await errorHandler(err, res, 'getProductById');
        return;
    }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
    try {
        const categoryId = req.params.categoryId;
        const products = await retrieveProducts({category: categoryId});
        await sendResponse({
            res,
            ...products
        });
        return;
    } catch (err) {
        await errorHandler(err, res, 'getProductsByCategory');
        return;
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
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
        if (authorization.status !== 200) {
            await sendResponse({
                res,
                status: 400,
                errorCode: authorization.errorCode,
                errorDescription: authorization.errorDescription,
            });
            return;
        }

        const productId = req.params.productId;

        // Fetch the product to get the image URL
        const existingProductResponse = await retrieveProducts({ _id: productId });
        if (existingProductResponse.status !== 200) {
            await sendResponse({
                res,
                ...existingProductResponse
            });
            return;
        }

        const existingProduct = existingProductResponse.data.products[0];
        if (!existingProduct) {
            await sendResponse({
                res,
                ...errors['P404'],
            });
            return;
        }

        // Extract the image key from the image URL
        const existingImageKey = existingProduct.image.split('/').pop();
        if (existingImageKey) {
            try {
                // Delete the image from S3
                await deleteImageFromS3(existingImageKey);
            } catch (deleteError) {
                console.error('Error deleting image from S3:', deleteError);
                await sendResponse({
                    res,
                    ...errors['P403'],
                });
                return;
            }
        }

        // Delete the product from MongoDB
        const deletedProduct = await deleteProductFromMongo(productId);
        await sendResponse({
            res,
            ...deletedProduct
        });

    } catch (err) {
        await errorHandler(err, res, 'deleteProduct');
    }
};
