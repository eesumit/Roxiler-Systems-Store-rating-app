import { body } from "express-validator";
const createRatingValidation = [
  body('storeId')
    .isUUID()
    .withMessage('Store ID must be a valid UUID'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5')
];
const updateRatingValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5')
];
export { createRatingValidation, updateRatingValidation
};