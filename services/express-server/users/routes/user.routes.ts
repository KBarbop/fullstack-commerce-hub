import express from 'express';
import {
    authorizeUserSession,
    deleteUser,
    editUserData,
    getAllUsers, getMe,
    getUser,
    getUsersByType,
    logInUser,
    logOutUser, updateUserEmail
} from "../controllers/user.controller";

const router = express.Router();

router.post('/log-in', logInUser);

router.post('/log-out', logOutUser);

router.get('/get-user/:userId', getUser);

router.get('/get-users', getAllUsers);

router.post('/get-users-by-type', getUsersByType);

router.patch('/edit-user-data/:userId', editUserData);

router.patch('/update-user-email/:userId', updateUserEmail);

router.delete('/delete-user/:userId', deleteUser);

router.post('/authorize-session', authorizeUserSession);

router.get('/me', getMe);

export default router;
