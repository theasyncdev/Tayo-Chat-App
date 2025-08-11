import { asyncHandler } from '../middlewares/errorMiddleware.js';
import { ApiError } from '../middlewares/errorMiddleware.js';
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { createToken } from '../utils/createToken.js';
import { cookieOptions, HTTP_STATUS } from '../constants/constants.js';

export const handleSignUp = asyncHandler(async (req, res) => {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
        throw new ApiError(HTTP_STATUS.VALIDATION_ERROR, 'All fields are required');
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        if (existingUser.username === username) {
            throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Username already taken');
        }
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await User.create({ name, username, email, password: hashedPassword });

    const authToken = createToken(createdUser.username, createdUser.email);

    res.status(HTTP_STATUS.CREATED)
        .cookie('token', authToken, cookieOptions)
        .json({ success: true, message: 'user created!', token: authToken });
});

export const handleSignIn = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        throw new ApiError(HTTP_STATUS.VALIDATION_ERROR, 'All fields are Required!');
    }

    const checkUser = await User.findOne({ username });

    if (!checkUser) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'User does not exist!');
    }

    const matchPassword = await bcrypt.compare(password, checkUser.password);

    if (!matchPassword) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Incorrect Password!');
    }

    const authToken = createToken(checkUser);

    res.status(HTTP_STATUS.OK)
        .cookie('authToken', authToken, cookieOptions)
        .json({ success: true, message: 'Sign in  success', token: authToken });
});
