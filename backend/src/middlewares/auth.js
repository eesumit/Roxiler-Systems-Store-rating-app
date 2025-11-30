import { verifyToken } from "../utils/generateToken.js";
import User from "../models/User.js";

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "No token found",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }

        const user = await User.findByPk(decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Authentication failed",
            error: error.message,
        });
    }
};

export default authenticate;
