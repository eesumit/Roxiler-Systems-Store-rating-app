import { body, query } from 'express-validator';


const createStoreValidation = [
    body('name')
        .trim()
        .isLength({ min: 3, max: 60 })
        .withMessage('Store name must be between 3 and 60 characters'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Must be a valid email address')
        .normalizeEmail(),
        
    body('address')
        .trim()
        .isLength({ min: 1, max: 400 })
        .withMessage('Address is required and must not exceed 400 characters'),

    body('ownerId')
        .optional()
        .isUUID()
        .withMessage('Owner ID must be a valid UUID')
];
const updateStoreValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 3, max: 60 })
        .withMessage('Store name must be between 3 and 60 characters'),

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
        .withMessage('Address must not exceed 400 characters')
];
const storeQueryValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),

    query('search')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search query must not exceed 100 characters')
];

export { createStoreValidation, updateStoreValidation, storeQueryValidation };