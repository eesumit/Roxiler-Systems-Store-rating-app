import storeService from '../services/storeService.js';
class StoreController {
    // Get all stores
    async getAllStores(req, res) {
        try {
            const currentUser = req.user || null; // Optional auth
            const result = await storeService.getAllStores(req.query, currentUser);
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
    // Get store by ID
    async getStoreById(req, res) {
        try {
            const { id } = req.params;
            const currentUser = req.user || null;
            const store = await storeService.getStoreById(id, currentUser);
            res.status(200).json({
                success: true,
                data: store
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }
    // Create store (admin only)
    async createStore(req, res) {
        try {
            const store = await storeService.createStore(req.body);
            res.status(201).json({
                success: true,
                message: 'Store created successfully',
                data: store
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    // Update store (admin only)
    async updateStore(req, res) {
        try {
            const { id } = req.params;
            const store = await storeService.updateStore(id, req.body);
            res.status(200).json({
                success: true,
                message: 'Store updated successfully',
                data: store
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    // Delete store (admin only)
    async deleteStore(req, res) {
        try {
            const { id } = req.params;
            const result = await storeService.deleteStore(id);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}
export default new StoreController();