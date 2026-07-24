import express from 'express';
import {
    addCustomerAddress,
    editActiveStatus, editPhoneNumber,
    editVerificationStatus, removeCustomerAddress,
    signUpCustomer,
    updateCustomerPaymentInfo
} from "../controllers/customer.controller";

const router = express.Router();

router.post('/sign-up', signUpCustomer);

router.patch('/update-verification-status/:userId', editVerificationStatus);

router.patch('/update-phone-number/:userId', editPhoneNumber);

router.patch('/update-active-status/:userId', editActiveStatus);

router.patch('/update-payment-info/:userId', updateCustomerPaymentInfo);

router.patch('/add-address/:customerId', addCustomerAddress);

router.patch('/remove-address/:customerId', removeCustomerAddress);

export default router;
