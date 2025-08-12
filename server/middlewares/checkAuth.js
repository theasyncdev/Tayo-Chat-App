import { HTTP_STATUS } from '../constants/constants.js';
import { verifyToken } from '../utils/createToken.js';
import { ApiError, asyncHandler } from './errorMiddleware.js';
import User from '../models/user.model.js';

export const checkAuth = asyncHandler(async (req, res, next) => {
    const authHeader = req.get('Authorization');
    const authToken = authHeader?.startsWith('Bearer ')
        ? authHeader.substring(7)
        : req.cookies?.authToken;

    if (!authToken) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Authorization token missing or malformed');
    }

    const decode = verifyToken(authToken);

    if (!decode?.id) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid token payload!');
    }

    const user = await User.findById(decode.id).select('-password');

    if (!user) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Unauthorized!');
    }

    req.user = user;
    next();
});
