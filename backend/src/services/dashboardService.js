import User from "../models/User.js";
import Store from "../models/Store.js";
import Rating from "../models/Rating.js";
import { sequelize } from "../config/database.js";
class DashboardService {
    // Admin dashboard statistics
    async getAdminStats() {
        // Get counts
        const totalUsers = await User.count();
        const totalStores = await Store.count();
        const totalRatings = await Rating.count();
        // Get user role breakdown
        const usersByRole = await User.findAll({
            attributes: [
                'role',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['role']
        });
        // Get recent users
        const recentUsers = await User.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'name', 'email', 'role', 'createdAt']
        });
        // Get recent stores
        const recentStores = await Store.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'name', 'email', 'createdAt']
        });
        // Get rating distribution
        const ratingDistribution = await Rating.findAll({
            attributes: [
                'rating',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['rating'],
            order: [['rating', 'ASC']]
        });
        return {
            totalUsers,
            totalStores,
            totalRatings,
            usersByRole: usersByRole.map(u => ({
                role: u.role,
                count: parseInt(u.dataValues.count)
            })),
            recentUsers,
            recentStores,
            ratingDistribution: ratingDistribution.map(r => ({
                rating: r.rating,
                count: parseInt(r.dataValues.count)
            }))
        };
    }
    // Store owner dashboard statistics
    async getStoreOwnerStats(userId) {
        // Find user's store
        const user = await User.findByPk(userId, {
            include: [
                {
                    model: Store,
                    as: 'ownedStore',
                    required: true
                }
            ]
        });
        if (!user || !user.ownedStore) {
            throw new Error('No store found for this user');
        }
        const storeId = user.ownedStore.id;
        // Get ratings for this store
        const ratings = await Rating.findAll({
            where: { storeId },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        // Calculate statistics
        const totalRatings = ratings.length;
        const avgRating = totalRatings > 0
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
            : 0;
        // Rating distribution
        const distribution = {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0
        };
        ratings.forEach(r => {
            distribution[r.rating]++;
        });
        return {
            store: user.ownedStore,
            totalRatings,
            averageRating: avgRating.toFixed(2),
            ratingDistribution: Object.entries(distribution).map(([rating, count]) => ({
                rating: parseInt(rating),
                count
            })),
            recentRatings: ratings.slice(0, 10)
        };
    }
}
export default new DashboardService();