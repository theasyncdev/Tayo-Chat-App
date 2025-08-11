import { config } from 'dotenv';

config({ path: '.env.local' });

export const { PORT, MONGO_URI,  CLIENT_ORIGIN, JWT_SECRET } = process.env;
