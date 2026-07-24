import express from 'express';
import {
    createNewCategory,
    deleteCategory,
    editCategory,
    getAllCategories,
    getCategoryById
} from "./category.controller";

const router = express.Router();

router.post('/create-new-category', createNewCategory);

router.patch('/edit-category/:categoryId', editCategory);

router.get('/get-categories', getAllCategories);

router.get('/get-category/:categoryId', getCategoryById);

router.delete('/delete-category/:categoryId', deleteCategory);

export default router;
