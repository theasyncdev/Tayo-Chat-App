import { ApiError, ApiResponse } from '../utils/apiUtils.js';
import { HTTP_STATUS } from '../constants/constants.js';

export const globalErrorHandler = (err, _req, res, _next) => {
    console.error(err);

    if (err instanceof ApiError) {
        return new ApiResponse(err.statusCode || 500, err.message).send(res);
    }

    if (err.name === 'ValidationError') {
        return new ApiResponse(HTTP_STATUS.VALIDATION_ERROR, err.message).send(res);
    }

    if (err.code === 11000) {
        return new ApiResponse(HTTP_STATUS.CONFLICT, 'Duplicate field value entered').send(res);
    }

    return new ApiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Internal Server Error').send(res);
};
