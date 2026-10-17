import mongoose from "mongoose";

const globalCache = globalThis;

if (!globalCache.mongoose) {
  globalCache.mongoose = {
    conn: null,
    promise: null,
    uri: null,
  };
}

const cached = globalCache.mongoose;

export function getCleanMongoUri() {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    throw new Error("MONGODB_URI is missing from environment variables.");
  }

  if (
    !uri.startsWith("mongodb://") &&
    !uri.startsWith("mongodb+srv://")
  ) {
    throw new Error("Invalid MongoDB connection string format.");
  }

  return uri;
}

export function getMongoDatabaseName() {
  const uri = process.env.MONGODB_URI?.trim();
  const configuredName = uri?.match(
    /^mongodb(?:\+srv)?:\/\/[^/?]*(?:\/([^/?]*))?/i,
  )?.[1];

  return configuredName || mongoose.connection.name || null;
}

export function getMongoConnectionState() {
  return ["disconnected", "connected", "connecting", "disconnecting"][
    mongoose.connection.readyState
  ] || "unknown";
}

export function assertMongoConfigured() {
  getCleanMongoUri();
}

export async function connectDB() {
  const uri = getCleanMongoUri();

  // Reconnect if the configured URI has changed
  if (cached.uri && cached.uri !== uri) {
    await mongoose.disconnect();

    cached.conn = null;
    cached.promise = null;
    cached.uri = null;
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.uri = uri;

    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
      })
      .then((instance) => {
        console.info("[MongoDB] Connected", {
          database: instance.connection.name,
          state: "connected",
        });

        return instance;
      })
      .catch((error) => {
        cached.promise = null;
        cached.uri = null;
        console.error("[MongoDB] Connection failed", {
          database: getMongoDatabaseName(),
          state: getMongoConnectionState(),
          errorType: error?.name || "Error",
        });
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.conn = null;
    throw error;
  }
}