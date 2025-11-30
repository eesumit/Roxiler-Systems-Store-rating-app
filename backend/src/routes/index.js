import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import storeRoutes from './storeRoutes.js';
import ratingRoutes from './ratingRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
const router = express.Router();
// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/stores', storeRoutes);
router.use('/ratings', ratingRoutes);
router.use('/dashboard', dashboardRoutes);
// Health check
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is running'
    });
});
export default router;