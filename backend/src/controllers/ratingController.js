import ratingService from '../services/ratingService.js';
class RatingController {
    // Submit rating
    async submitRating(req, res) {
        try {
            const { storeId, rating } = req.body;
            const userId = req.user.id;
            const result = await ratingService.submitRating(userId, storeId, rating);
            res.status(201).json({
                success: true,
                message: 'Rating submitted successfully',
                data: result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    // Update rating
    async updateRating(req, res) {
        try {
            const { id } = req.params;
            const { rating } = req.body;
            const userId = req.user.id;
            const result = await ratingService.updateRating(id, userId, rating);
            res.status(200).json({
                success: true,
                message: 'Rating updated successfully',
                data: result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    // Get user's ratings
    async getMyRatings(req, res) {
        try {
            const userId = req.user.id;
            const ratings = await ratingService.getUserRatings(userId);
            res.status(200).json({
                success: true,
                data: ratings
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    // Get store ratings (for store owner)
    async getStoreRatings(req, res) {
        try {
            const { storeId } = req.params;
            const result = await ratingService.getStoreRatings(storeId);
            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}
export default new RatingController();