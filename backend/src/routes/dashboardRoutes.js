import express from 'express';
import dashboardController from '../controllers/dashboardController.js';
import authenticate from '../middlewares/auth.js';
import checkRole from '../middlewares/roleCheck.js';
const router = express.Router();
// Admin dashboard
router.get('/admin-stats',
    authenticate,
    checkRole('admin'),
    dashboardController.getAdminStats
);
// Store owner dashboard
router.get('/store-stats',
    authenticate,
    checkRole('store_owner'),
    dashboardController.getStoreOwnerStats
);
export default router;