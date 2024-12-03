"use server";

import mongoose from "mongoose";

let cachedConnection: typeof mongoose | null = null;

export async function connectDB() {
  if (cachedConnection) {
    console.log("Using existing database connection");
    return cachedConnection;
  }
  const dbURL = process.env.DB_URL;
  if (!dbURL) {
    console.log("DB_URL is not defined : " + dbURL);
    throw new Error(
      "Please define the DB_URL environment variable in your .env file"
    );
  }

  try {
    cachedConnection = await mongoose.connect(dbURL);
    console.log("Database connected successfully");
    return cachedConnection;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    // Reset the cached connection to ensure retry on next call
    cachedConnection = null;
    throw error;
  }
}
