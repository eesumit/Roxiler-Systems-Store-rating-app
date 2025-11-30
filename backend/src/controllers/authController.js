import authService from "../services/authService.js";
import emailService from "../services/emailService.js";

class AuthController {
    //SIGNUP controller calls signup service.
    async signup(req, res) {
        try {
            const { name, email, password, address } = req.body;

            const result = await authService.signup({ name, email, password, address });


            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    user: result.user,
                    token: result.token
                }
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    //Login controller calls login service
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    user: result.user,
                    token: result.token
                }
            });

        } catch (error) {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }
    //Change password calls changePassword service
    async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = req.user.id;
            const result = await authService.changePassword(userId, currentPassword, newPassword);

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
    //Forgot password controller
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            const result = await authService.forgotPassword(email, process.env.FRONTEND_URL);

            //if user exists, only then send mail
            if (result.resetToken) {
                await emailService.sendPasswordResetEmail(email, result.resetToken, result.user.name);
            }

            res.status(200).json({
                success: true,
                message: 'If email exists, reset link has been sent'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to process request'
            });
        }
    }
    //Verify reset token
    async verifyResetToken(req, res) {
        try {
            const { token } = req.params;

            await authService.verifyResetToken(token);
            res.status(200).json({
                success: true,
                message: 'Token is valid'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    //Reset password
    async resetPassword(req, res) {
        try {
            const { token } = req.params;
            const { newPassword } = req.body;
            const result = await authService.resetPassword(token, newPassword);
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
    //Logout.
    async logout(req, res) {
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    }
}

export default new AuthController();