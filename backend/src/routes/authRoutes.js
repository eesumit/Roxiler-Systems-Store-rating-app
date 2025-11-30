import express from 'express';
import authController from '../controllers/authController.js';
import {
    signupValidation,
    loginValidation,
    changePasswordValidation,
    forgotPasswordValidation,
    resetPasswordValidation
} from '../validators/authValidator.js';
import validateRequest from '../validators/validateRequest.js';
import authenticate from '../middlewares/auth.js';
const router = express.Router();
// Public routes
router.post('/signup',
    signupValidation,
    validateRequest,
    authController.signup
);
router.post('/login',
    loginValidation,
    validateRequest,
    authController.login
);
router.post('/forgot-password',
    forgotPasswordValidation,
    validateRequest,
    authController.forgotPassword
);
router.get('/verify-reset-token/:token',
    authController.verifyResetToken
);
router.post('/reset-password/:token',
    resetPasswordValidation,
    validateRequest,
    authController.resetPassword
);
// Protected routes (require authentication)
router.post('/change-password',
    authenticate,
    changePasswordValidation,
    validateRequest,
    authController.changePassword
);
router.post('/logout',
    authenticate,
    authController.logout
);
export default router;