import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

/**
 * Connects to MongoDB using Mongoose
 */
export const connectDB = async (): Promise<typeof mongoose> => {
  if (!process.env.MONGO_URI) {
    throw new Error('❌ Missing MONGO_URI in environment variables');
  }

  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ Connected to MongoDB: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

/**
 * Disconnects from MongoDB
 */
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  } catch (error) {
    console.error('⚠️ Error disconnecting from MongoDB:', error);
  }
};
