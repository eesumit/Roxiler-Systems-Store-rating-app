import express from 'express';
import ratingController from '../controllers/ratingController.js';
import {
    createRatingValidation,
    updateRatingValidation
} from '../validators/ratingValidator.js';
import validateRequest from '../validators/validateRequest.js';
import authenticate from '../middlewares/auth.js';
const router = express.Router();
// All rating routes require authentication
router.post('/',
    authenticate,
    createRatingValidation,
    validateRequest,
    ratingController.submitRating
);
router.put('/:id',
    authenticate,
    updateRatingValidation,
    validateRequest,
    ratingController.updateRating
);
router.get('/my-ratings',
    authenticate,
    ratingController.getMyRatings
);
router.get('/store/:storeId',
    authenticate,
    ratingController.getStoreRatings
);
export default router;