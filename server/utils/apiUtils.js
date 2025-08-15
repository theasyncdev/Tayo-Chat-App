export class ApiResponse {
    constructor(statusCode, message, data = null) {
        this.statusCode = statusCode;
        this.message = message;
        this.status = statusCode < 400 ? 'Success' : 'Failed';
        if (data !== null) this.data = data;
    }

    send(res) {
        const {statusCode, ...body} = this
        return res.status(statusCode).json(body);
    }
}

export class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        ((this.statusCode = statusCode), (this.message = message));
    }
}

export const asyncHandler = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};
