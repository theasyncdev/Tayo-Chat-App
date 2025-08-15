import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.config.js';
import { ApiError } from '../utils/apiUtils.js';
import { HTTP_STATUS } from '../constants/constants.js';

// Create a JWT token
export const createToken = (user) => {
    const payload = {
        id: user._id,
        username: user.username
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn : '1d' });
};

// Verify a JWT token
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Token expired');
        }
        if (error.name === 'JsonWebTokenError') {
            throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid token');
        }
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Authentication failed');
    }
};
