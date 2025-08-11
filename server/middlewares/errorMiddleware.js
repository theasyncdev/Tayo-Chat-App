export class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        ((this.statusCode = statusCode), (this.message = message));
    }
}

export const asyncHandler = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};

export const globalErrorHandler = (err, req, res, next) => {
    console.log(err);
    if (err instanceof ApiError) {
        return res.status(err.statusCode || 500).json({ success: false, message: err.message });
    }
    if (err.name === 'ValidationError') {
        return res.status(400).json({ success: false, message: err.message });
    }
    if (err.code === 11000) {
        return res.status(409).json({ success: false, message: err.message });
    }

    return res.status(500).json({ success: false, message: 'Internal Server Error' });
};
