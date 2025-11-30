import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwt.js";

const generateToken = (payload) => {
    return jwt.sign(payload, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn
    });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, jwtConfig.secret);
    } catch (error) {
        return null;
    }
};

export { generateToken, verifyToken };