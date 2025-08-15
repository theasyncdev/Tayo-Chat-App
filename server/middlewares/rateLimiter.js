import rateLimit from 'express-rate-limit'


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 25, 
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true, 
    legacyHeaders: false,  
});

export default limiter;

