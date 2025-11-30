import userService from '../services/userService.js';
class UserController {
    // Get all users (admin only)
    async getAllUsers(req, res) {
        try {
            const result = await userService.getAllUsers(req.query);
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
    // Get user by ID
    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await userService.getUserById(id);
            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }
    // Create user (admin only)
    async createUser(req, res) {
        try {
            const user = await userService.createUser(req.body);
            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: user
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    // Update user
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const user = await userService.updateUser(id, req.body);
            res.status(200).json({
                success: true,
                message: 'User updated successfully',
                data: user
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    // Delete user
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const result = await userService.deleteUser(id);
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
    // Get current user profile
    async getProfile(req, res) {
        try {
            const user = await userService.getUserById(req.user.id);
            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }
}
export default new UserController();