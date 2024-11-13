import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`.blue.bold);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};