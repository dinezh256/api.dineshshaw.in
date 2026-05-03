const mongoose = require("mongoose");

// Cache the connection on `global` so Vercel serverless warm invocations
// reuse the same connection instead of creating a new one every time.
let cached = global._mongooseConnection;
if (!cached) cached = global._mongooseConnection = { conn: null, promise: null };

const dbName = "portfolio";

module.exports = async () => {
  if (cached.conn) return cached.conn;

  const uri =
    (process.env.NODE_ENV === "Dev"
      ? process.env.MONGODB_URL_LOCAL
      : process.env.MONGODB_URL) +
    `/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

  if (!cached.promise) {
    mongoose.set("strictQuery", true);
    cached.promise = mongoose.connect(uri).then((m) => {
      console.log("Connected to DB successfully");
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("Could not connect to DB:", error.message);
    throw error;
  }

  return cached.conn;
};
