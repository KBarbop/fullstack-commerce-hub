import express from 'express';
import {
    addIngredients,
    changeProductCategory,
    createNewProduct,
    deleteProduct,
    editProductData,
    getAllProducts,
    getProductById,
    getProductsByCategory, removeIngredients
} from "./product.controller";

const router = express.Router();

router.post('/create-new-product', createNewProduct);

router.patch('/edit-product/:productId', editProductData);

router.patch('/change-product-category/:productId', changeProductCategory);

router.patch('/add-ingredients/:productId', addIngredients);

router.patch('/remove-ingredients/:productId', removeIngredients);

router.get('/get-products', getAllProducts);

router.get('/get-product/:productId', getProductById);

router.get('/get-products-by-category/:categoryId', getProductsByCategory);

router.delete('/delete-product/:productId', deleteProduct);

export default router;
