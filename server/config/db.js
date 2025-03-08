const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    await mongoose.connect(uri);
  } catch (error) {
    process.exit(1);
  }
};

module.exports = connectDB;
