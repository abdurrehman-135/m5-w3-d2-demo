const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let memoryServerInstance = null;
const DEFAULT_MONGO_URI = "mongodb://127.0.0.1:27017/book-list-app";

async function resolveMongoUri() {
  if (process.env.MONGODB_URI) {
    console.log("Using configured MongoDB connection string.");
    return process.env.MONGODB_URI;
  }

  if (process.env.USE_IN_MEMORY_MONGO === "true") {
    if (process.env.NODE_ENV === "production") {
      throw new Error("USE_IN_MEMORY_MONGO is not supported in production.");
    }

    if (!memoryServerInstance) {
      memoryServerInstance = await MongoMemoryServer.create({
        instance: {
          dbName: "book-list-app",
        },
      });
    }

    console.log("Using in-memory MongoDB for local development.");
    return memoryServerInstance.getUri();
  }

  console.log(`Using local MongoDB connection string: ${DEFAULT_MONGO_URI}`);
  return DEFAULT_MONGO_URI;
}

async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const mongoUri = await resolveMongoUri();

  try {
    await mongoose.connect(mongoUri);
  } catch (error) {
    if (!process.env.MONGODB_URI && process.env.USE_IN_MEMORY_MONGO !== "true") {
      error.message = `${error.message} Start MongoDB locally at ${DEFAULT_MONGO_URI}, set MONGODB_URI, or enable USE_IN_MEMORY_MONGO=true.`;
    }

    throw error;
  }

  return mongoose.connection;
}

async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  if (memoryServerInstance) {
    await memoryServerInstance.stop();
    memoryServerInstance = null;
  }
}

module.exports = {
  connectDatabase,
  disconnectDatabase,
};
