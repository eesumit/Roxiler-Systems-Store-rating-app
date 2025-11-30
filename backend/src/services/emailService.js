import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
class EmailService {
    constructor() {
        // Create transporter
        this.transporter = nodemailer.createTransport({
            service:"gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }
    // Send password reset email
    async sendPasswordResetEmail(email, resetToken, userName) {
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Password Reset Request - Store Rating Platform',
            html: this.getPasswordResetTemplate(resetLink, userName)
        };
        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Password reset email sent to ${email}`);
        } catch (error) {
            console.error('❌ Email sending failed:', error);
            throw new Error('Failed to send email');
        }
    }
    // Password reset email template
    getPasswordResetTemplate(resetLink, userName) {
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
          }
          .content {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .button:hover {
            background-color: #0056b3;
          }
          .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <h2>Password Reset Request</h2>
            <p>Hi ${userName},</p>
            <p>You requested to reset your password for your Store Rating Platform account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetLink}" class="button">Reset Password</a>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #007bff;">${resetLink}</p>
            <p><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
            <p>Thanks,<br>Store Rating Platform Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    }
    // Test email configuration
    async testConnection() {
        try {
            await this.transporter.verify();
            console.log('✅ Email service is ready');
            return true;
        } catch (error) {
            console.error('❌ Email service error:', error);
            return false;
        }
    }
}
export default new EmailService();