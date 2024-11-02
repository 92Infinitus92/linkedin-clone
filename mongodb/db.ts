import mongoose from "mongoose";

const connectionString = `mongodb+srv://cripwalker9202:${process.env.MONGODB_PASSWORD}@cluster0.0ipq8.mongodb.net/linkedinclone?retryWrites=true&w=majority&appName=Cluster0`;

if (!connectionString) {
  throw new Error("Please provide a valid connection string!");
}

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log("Already connected to MongoDB!");
    return;
  }
  try {
    await mongoose.connect(connectionString);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw new Error("Failed to connect to MongoDB");
  }
};
