import { body, query } from "express-validator";

const createUserValidation = [
    body('name')
        .trim()
        .isLength({ min: 3, max: 60 })
        .withMessage('Name must be atleast 3 and atmost 60 chars long.'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Must be a valid email address')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 8, max: 16 })
        .withMessage('Password must be between 8 and 16 characters')
        .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
        .withMessage('Password must contain at least one uppercase letter and one special character'),

    body('address')
        .trim()
        .isLength({ min: 1, max: 400 })
        .withMessage('Address is required and must not exceed 400 characters'),

    body('role')
        .isIn(['admin', 'user', 'store_owner'])
        .withMessage('Role must be admin, user, or store_owner')
];

const updateUserValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 3, max: 60 })
        .withMessage('Name must be between 3 and 60 characters'),

    body('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Must be a valid email address')
        .normalizeEmail(),

    body('address')
        .optional()
        .trim()
        .isLength({ min: 1, max: 400 })
        .withMessage('Address must not exceed 400 characters'),

    body('role')
        .optional()
        .isIn(['admin', 'user', 'store_owner'])
        .withMessage('Role must be admin, user, or store_owner')
];

const queryValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),

    query('sortBy')
        .optional()
        .isIn(['name', 'email', 'createdAt'])
        .withMessage('Sort by must be name, email, or createdAt'),

    query('order')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Order must be asc or desc'),

    query('search')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search query must not exceed 100 characters'),

    query('role')
        .optional()
        .isIn(['admin', 'user', 'store_owner'])
        .withMessage('Role filter must be admin, user, or store_owner')
];

export { createUserValidation, updateUserValidation, queryValidation };