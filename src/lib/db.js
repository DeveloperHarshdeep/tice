import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export function getCleanMongoUri() {
  let uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not configured. Add it to your environment variables (e.g., mongodb://127.0.0.1:27017/talent-institute).",
    );
  }

  // Gracefully correct accidental http/https prefixes in environment configurations
  if (uri.startsWith("http://")) {
    uri = uri.replace(/^http:\/\//, "mongodb://");
  } else if (uri.startsWith("https://")) {
    uri = uri.replace(/^https:\/\//, "mongodb+srv://");
  }

  return uri;
}

export function assertMongoConfigured() {
  getCleanMongoUri();
}

export async function connectDB() {
  const uri = getCleanMongoUri();

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
      })
      .then((mongooseInstance) => {
        return mongooseInstance;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
