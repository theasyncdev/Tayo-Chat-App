import { config } from 'dotenv';

config({ path: '.env.local' });

export const {
    PORT,
    MONGO_URI,
    CLIENT_ORIGIN,
    JWT_SECRET,
    FRONTEND_URL,
    CLOUDINARY_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET
} = process.env;
