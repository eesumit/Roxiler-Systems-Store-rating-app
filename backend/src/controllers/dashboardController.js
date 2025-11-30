import dashboardService from '../services/dashboardService.js';
class DashboardController {
    // Admin dashboard stats
    async getAdminStats(req, res) {
        try {
            const stats = await dashboardService.getAdminStats();
            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    // Store owner dashboard stats
    async getStoreOwnerStats(req, res) {
        try {
            const userId = req.user.id;
            const stats = await dashboardService.getStoreOwnerStats(userId);
            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}
export default new DashboardController();