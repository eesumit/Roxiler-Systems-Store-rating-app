import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import crypto from 'crypto';

class AuthService {
    //signup
    async signup(userData) {
        //check if user already exist
        const existingUser = await User.findOne({
            where: { email: userData.email }
        });

        if (existingUser) {
            throw new Error('User already exists.');
        }

        //create user.
        const user = await User.create({
            name: userData.name,
            email: userData.email,
            password: userData.password,
            address: userData.address,
            role: 'user'
        });

        //generate jwt token
        const token = generateToken({
            userId: user.id,
            role: user.role
        });

        return { user, token };
    }

    //login
    async login(email, password) {

        //find if user exist or not
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw new Error('Invalid email or password');
        }

        //check if password is matching
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        //generate token
        const token = generateToken({
            userId: user.id,
            role: user.role
        });

        return { user, token };
    }

    // Change password
    async changePassword(userId, currentPassword, newPassword) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }
        // Verify current password
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            throw new Error('Current password is incorrect');
        }
        // Update password (hashing happens in model hook)
        user.password = newPassword;
        await user.save();
        return { message: 'Password changed successfully' };
    }

    // Forgot password - generate reset token
    //Generates cryptographically secure random data
    async forgotPassword(email, frontendUrl) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            // Don't reveal if email exists (security)
            return { message: 'If email exists, reset link has been sent' };
        }
        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash token before saving (security)
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        // Set token and expiry (1 hour)
        user.resetToken = hashedToken;
        user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
        await user.save();
        // Return unhashed token (to send in email)
        return { resetToken, user };
    }

    // Verify reset token
    async verifyResetToken(token) {
        // Hash the token to compare with database
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');
        const user = await User.findOne({
            where: {
                resetToken: hashedToken,
                resetTokenExpiry: { [require('sequelize').Op.gt]: new Date() }
            }
        });
        if (!user) {
            throw new Error('Invalid or expired reset token');
        }
        return { valid: true };
    }

    // Reset password with token
    async resetPassword(token, newPassword) {
        // Hash token
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');
        // Find user with valid token
        const user = await User.findOne({
            where: {
                resetToken: hashedToken,
                resetTokenExpiry: { [require('sequelize').Op.gt]: new Date() }
            }
        });
        if (!user) {
            throw new Error('Invalid or expired reset token');
        }
        // Update password and clear reset token
        user.password = newPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();
        return { message: 'Password reset successfully' };
    }
}
export default new AuthService();