import mongoose, { Mongoose } from "mongoose";


import { DB_NAME } from "./constants";

let isConnected = false; 


const connectDB = async (): Promise<Mongoose | void> => {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return mongoose;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: DB_NAME,
    });

    isConnected = true;
    console.log(`MongoDB connected! Host: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default connectDB;
