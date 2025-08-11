import mongoose from 'mongoose';
import { MONGO_URI } from './env.config.js';

export const connectToDataBase = async () => {
  if (!MONGO_URI) {
    throw new Error('MONGO_URI is missing in environment variables!');
  }

  try {
    await mongoose.connect(MONGO_URI, { dbName: 'tayodb' });
    console.log('Database Connected!');
  } catch (error) {
    console.error('Database Connection Error:', error);
    throw error;
  }
};
