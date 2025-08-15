import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { createToken } from '../utils/createToken.js';
import { cookieOptions, HTTP_STATUS } from '../constants/constants.js';
import { ApiResponse, ApiError ,asyncHandler } from '../utils/apiUtils.js';

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

    const authToken = createToken(createdUser);

    return new ApiResponse(HTTP_STATUS.CREATED, 'User created!', { token: authToken })
        .send(res)
        .cookie('authToken', authToken, cookieOptions);
});

export const handleSignIn = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        throw new ApiError(HTTP_STATUS.VALIDATION_ERROR, 'All fields are required!');
    }

    const checkUser = await User.findOne({ username });
    if (!checkUser) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'User does not exist!');
    }

    const matchPassword = await bcrypt.compare(password, checkUser.password);
    if (!matchPassword) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Incorrect password!');
    }

    const authToken = createToken(checkUser);

    return new ApiResponse(HTTP_STATUS.OK, 'Sign in success', { token: authToken })
        .send(res)
        .cookie('authToken', authToken, cookieOptions);
});
