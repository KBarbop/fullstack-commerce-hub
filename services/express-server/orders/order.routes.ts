import express from 'express';
import {
    cancelOrder,
    completeOrder,
    createNewOrder,
    deleteOrder, editIsPaid,
    editOrderData,
    getAllOrders,
    getOrderById,
    getOrdersByUser, setEstimatedTime
} from "./order.controller";
import { notifyClients } from '../server';

const router = express.Router();

router.post('/create-new-order', async (req, res, next) => {
    try {
        const order = await createNewOrder(req, res);
        notifyClients(order); // Notify WebSocket clients
    } catch (error) {
        next(error);
    }
});

router.patch('/edit-order/:orderId', editOrderData);
router.patch('/complete-order/:orderId', completeOrder);
router.patch('/paid-order/:orderId', editIsPaid);
router.patch('/cancel-order/:orderId', cancelOrder);
router.patch('/set-estimated-time/:orderId', setEstimatedTime);
router.get('/get-orders', getAllOrders);
router.get('/get-order/:orderId', getOrderById);
router.get('/get-orders-by-user/:userId', getOrdersByUser);
router.delete('/delete-order/:orderId', deleteOrder);

export default router;
