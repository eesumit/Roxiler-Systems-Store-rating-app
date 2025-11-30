import express from 'express';
import storeController from '../controllers/storeController.js';
import {
    createStoreValidation,
    updateStoreValidation,
    storeQueryValidation
} from '../validators/storeValidator.js';
import validateRequest from '../validators/validateRequest.js';
import authenticate from '../middlewares/auth.js';
import checkRole from '../middlewares/roleCheck.js';
const router = express.Router();
// Public/authenticated routes
router.get('/',
    storeQueryValidation,
    validateRequest,
    storeController.getAllStores
);
router.get('/:id',
    storeController.getStoreById
);
// Admin only routes
router.post('/',
    authenticate,
    checkRole('admin'),
    createStoreValidation,
    validateRequest,
    storeController.createStore
);
router.put('/:id',
    authenticate,
    checkRole('admin'),
    updateStoreValidation,
    validateRequest,
    storeController.updateStore
);
router.delete('/:id',
    authenticate,
    checkRole('admin'),
    storeController.deleteStore
);
export default router;