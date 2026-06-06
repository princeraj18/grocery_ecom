import mongoose from "mongoose";

const connectDB = async (retries = 5, intervalMs = 5000) => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not set in environment');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database Connection Error:', error && error.message ? error.message : error);
    if (retries > 0) {
      console.log(`Retrying to connect in ${intervalMs / 1000}s... (${retries - 1} retries left)`);
      setTimeout(() => connectDB(retries - 1, intervalMs), intervalMs);
    } else {
      console.error('All retries exhausted. Exiting.');
      process.exit(1);
    }
  }
};

export default connectDB;