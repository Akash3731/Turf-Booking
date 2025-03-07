const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Add this debug line
    console.log("MONGODB_URI:", process.env.MONGODB_URI);

    // Provide a fallback URI if the environment variable is undefined
    const uri =
      process.env.MONGODB_URI ||
      "mongodb+srv://admin:admin@cluster0.pm4p3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

    console.log("Using MongoDB URI:", uri);

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
