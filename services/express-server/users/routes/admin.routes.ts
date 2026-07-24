import express from 'express';
import {editAdminRole, signUpAdmin} from "../controllers/admin.controller";

const router = express.Router();

router.post('/sign-up', signUpAdmin);

router.patch('/edit-admin-role/:userId', editAdminRole);

export default router;
