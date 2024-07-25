import mongoose from "mongoose";
import { config } from "./config";

export const connectDb = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("database connection established");
    });
    mongoose.connection.on("error", () => {
      console.log("Error connecting to database");
    });
    await mongoose.connect(config.mongoUrl as string);
  } catch (error) {
    console.log("database connection error", error);
    process.exit(1);
  }
};
