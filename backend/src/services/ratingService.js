import User from "../models/User.js";
import Store from "../models/Store.js";
import Rating from "../models/Rating.js";

class RatingService {
    // Submit rating
    async submitRating(userId, storeId, ratingValue) {
        // Check if store exists
        const store = await Store.findByPk(storeId);
        if (!store) {
            throw new Error('Store not found');
        }
        // Check if user already rated this store
        const existingRating = await Rating.findOne({
            where: { userId, storeId }
        });
        if (existingRating) {
            throw new Error('You have already rated this store. Use update instead.');
        }
        // Create rating
        const rating = await Rating.create({
            userId,
            storeId,
            rating: ratingValue
        });
        return rating;
    }
    // Update rating
    async updateRating(ratingId, userId, newRatingValue) {
        const rating = await Rating.findByPk(ratingId);
        if (!rating) {
            throw new Error('Rating not found');
        }
        // Ensure user owns this rating
        if (rating.userId !== userId) {
            throw new Error('You can only update your own ratings');
        }
        rating.rating = newRatingValue;
        await rating.save();
        return rating;
    }
    // Get user's ratings
    async getUserRatings(userId) {
        const ratings = await Rating.findAll({
            where: { userId },
            include: [
                {
                    model: Store,
                    as: 'store',
                    attributes: ['id', 'name', 'address']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        return ratings;
    }
    // Get ratings for a store (for store owner)
    async getStoreRatings(storeId) {
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
        // Calculate average
        const avgRating = ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
            : 0;
        return {
            ratings,
            averageRating: avgRating.toFixed(2),
            totalRatings: ratings.length
        };
    }
}
export default new RatingService();