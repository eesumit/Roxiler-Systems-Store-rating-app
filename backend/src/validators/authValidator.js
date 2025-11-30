import { body } from "express-validator";
//for sign up
const signupValidation = [
    body('name')
        .trim()
        .isLength({ min: 3, max: 60 })
        .withMessage('Name must be between 3 to 60 char long')
        .matches(/^[a-zA-Z ]+$/)
        .withMessage('Name can only contains letters and spaces'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Valid email required')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 6, max: 16 })
        .withMessage('Password must be between 6 to 16 chars long')
        .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
        .withMessage('Password must contains at least one uppercase letter and one special character(!@#$%^&*)')

];

//for login
const loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Must be a valid email address')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password is required')

];

//password changing validations
const changePasswordValidation = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),

    body('newPassword')
        .isLength({ min: 8, max: 16 })
        .withMessage('New password must be between 8 and 16 characters')
        .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
        .withMessage('New password must contain at least one uppercase letter and one special character'),

    body('confirmPassword')
        .custom((value, { req }) => value === req.body.newPassword)
        .withMessage('Passwords do not match')

];


// Forgot password validation
const forgotPasswordValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Must be a valid email address')
        .normalizeEmail()
];


// Reset password validation
const resetPasswordValidation = [
    body('newPassword')
        .isLength({ min: 8, max: 16 })
        .withMessage('Password must be between 8 and 16 characters')
        .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
        .withMessage('Password must contain at least one uppercase letter and one special character'),

    body('confirmPassword')
        .custom((value, { req }) => value === req.body.newPassword)
        .withMessage('Passwords do not match')
];

export {signupValidation,loginValidation,changePasswordValidation,forgotPasswordValidation,resetPasswordValidation};