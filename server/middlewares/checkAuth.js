import { JWT_SECRET } from '../config/env.config.js';
import { HTTP_STATUS } from '../constants/constants.js';
import { verifyToken } from '../utils/createToken.js';
import { ApiError, asyncHandler } from './errorMiddleware.js';
import User from '../models/user.model.js';

export const checkAuth = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Authorization token missing or malformed');
    }

    const authtoken = authHeader.split(' ')[1];

    const decode = verifyToken(authtoken, JWT_SECRET);
    const user = await User.findOne({ username: decode.username }).select('-password');

    if (!user) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Unauthorized!');
    }

    req.user = user;
    next();
});
