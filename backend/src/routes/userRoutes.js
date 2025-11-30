import express from 'express';
import userController from '../controllers/userController.js';
import {
    createUserValidation,
    updateUserValidation,
    queryValidation
} from '../validators/userValidator.js';
import validateRequest from '../validators/validateRequest.js';
import authenticate from '../middlewares/auth.js';
import checkRole from '../middlewares/roleCheck.js';
const router = express.Router();
// Get current user profile
router.get('/profile',
    authenticate,
    userController.getProfile
);
// Admin only routes
router.get('/',
    authenticate,
    checkRole('admin'),
    queryValidation,
    validateRequest,
    userController.getAllUsers
);
router.get('/:id',
    authenticate,
    checkRole('admin'),
    userController.getUserById
);
router.post('/',
    authenticate,
    checkRole('admin'),
    createUserValidation,
    validateRequest,
    userController.createUser
);
router.put('/:id',
    authenticate,
    checkRole('admin'),
    updateUserValidation,
    validateRequest,
    userController.updateUser
);
router.delete('/:id',
    authenticate,
    checkRole('admin'),
    userController.deleteUser
);
export default router;