const mongoose = require("mongoose");

const RETRY_DELAY_MS = 5000;

// Atlas na mile to server band mat karo — har 5 second baad dobara try karo
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`MongoDB Error: ${error.message}`);
    console.log(`Retrying MongoDB connection in ${RETRY_DELAY_MS / 1000}s...`);
    setTimeout(connectDB, RETRY_DELAY_MS);
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected — the driver will try to reconnect.");
});

mongoose.connection.on("reconnected", () => {
  console.log("MongoDB reconnected.");
});

module.exports = connectDB;
