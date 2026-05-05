import mongoose from "mongoose";
import { config } from "./config.js";
import { logger } from "./logger.js";

// Cache the connection on `global` so Vercel serverless warm invocations
// reuse the same connection instead of creating a new one every time.
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var _mongooseConnection: MongooseCache | undefined;
}

let cached = global._mongooseConnection;
if (!cached) {
  cached = global._mongooseConnection = { conn: null, promise: null };
}

const connectionStates: Record<number, string> = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

const connectDB = async () => {
  if (cached!.conn) return cached!.conn;
  const uri = `${config.mongoUri}/${config.dbName}?retryWrites=true&w=majority&appName=Cluster0`;

  if (!cached!.promise) {
    mongoose.set("strictQuery", true);
    cached!.promise = mongoose.connect(uri).then((m) => {
      logger.info("database_connected", { dbName: config.dbName });
      return m;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (error) {
    cached!.promise = null;
    if (error instanceof Error) {
      logger.error("database_connection_failed", { error: error.message });
    }
    throw error;
  }

  return cached!.conn;
};

export const getDatabaseStatus = () => ({
  readyState: connectionStates[mongoose.connection.readyState] ?? "unknown",
  host: mongoose.connection.host || null,
  name: mongoose.connection.name || config.dbName,
});

export default connectDB;
