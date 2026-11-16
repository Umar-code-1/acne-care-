const mongoose = require("mongoose");

// Try the main database (MONGO_URI, usually Atlas) first. If it can't be
// reached — e.g. the network blocks port 27017 or the cluster is paused —
// fall back to MONGO_URI_FALLBACK (usually a local MongoDB) when it is set.
const connectDB = async () => {
  const targets = [
    ["main", process.env.MONGO_URI],
    ["fallback", process.env.MONGO_URI_FALLBACK],
  ].filter(([, uri]) => uri);

  for (const [label, uri] of targets) {
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
      console.log(`MongoDB Connected (${label}): ${conn.connection.host}`);
      return;
    } catch (error) {
      console.log(`MongoDB Error (${label}):`, error.message);
      await mongoose.disconnect().catch(() => {});
    }
  }

  console.log("Could not connect to any MongoDB database. Exiting.");
  process.exit(1);
};

module.exports = connectDB;
