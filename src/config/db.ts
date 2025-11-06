import * as dotenv from 'dotenv';
import mongoose, { Mongoose } from 'mongoose';

dotenv.config({ path: ".env" });

/**
 * Connects to MongoDB using Mongoose.
 * Uses the MONGO_URI from environment variables.
 * @returns The Mongoose connection object
 * @throws Throws an error if MONGO_URI is missing or connection fails
 */
export const connectDB = async (): Promise<Mongoose> => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('❌ Missing MONGO_URI in environment variables');
  }

  try {
    const connection = await mongoose.connect(uri);
 
    // await import("@/models/Batch");
    console.log(`✅ Connected to MongoDB: ${connection.connection.host}`);
    console.log(Object.keys(mongoose.models));
    return connection;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

/**
 * Disconnects from MongoDB.
 * Logs errors if any occur during disconnection.
 */
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  } catch (error) {
    console.error('⚠️ Error disconnecting from MongoDB:', error);
  }
};
