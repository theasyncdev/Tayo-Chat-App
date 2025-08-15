import express from 'express';
import { PORT, CLIENT_ORIGIN } from './config/env.config.js';
import { connectToDataBase } from './config/db.config.js';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { globalErrorHandler } from './middlewares/errorMiddleware.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import { checkAuth } from './middlewares/checkAuth.js';
import messageRouter from './routes/message.routes.js';
import groupRouter from './routes/group.routes.js';
import limiter from './middlewares/rateLimiter.js';

const app = express();

// Basic environment validation
if (!PORT) {
    console.error('Error: PORT is not defined in environment variables.');
    process.exit(1);
}

// Middleware setup
app.use(helmet());
app.use(limiter)
app.use(
    cors({
        origin: CLIENT_ORIGIN || '*',
        credentials: true
    })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes setup
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', checkAuth, userRouter);
app.use('/api/v1/messages', checkAuth, messageRouter);
app.use('/api/v1/groups',checkAuth, groupRouter);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'HELLO FROM TAYO API' });
});

// Global Error handling
app.use(globalErrorHandler);

// Connect to DB and then start server
async function startServer() {
    try {
        await connectToDataBase();
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to connect to the database:', err);
        process.exit(1);
    }
}

startServer();
