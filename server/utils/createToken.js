import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.config.js';
import { ApiError } from '../middlewares/errorMiddleware.js';
import { HTTP_STATUS } from '../constants/constants.js';

// Function for creating a JWT token
export const createToken = (user) => {
    const payload = {
        username: user.username,
        email: user.email
    };

    const token = jwt.sign(payload, JWT_SECRET);

    return token;
};
// Function for verifying a JWT token
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid or expired token');
    }
};
