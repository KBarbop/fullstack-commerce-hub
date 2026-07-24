import express from 'express';
import {sendEmail} from "./email-service.controller";

const router = express.Router();

router.post('/send-email', sendEmail);

export default router;
