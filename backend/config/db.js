const mongoose = require('mongoose');

let mongoServer = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/imovies';

  try {
    console.log(`Connecting to MongoDB at: ${uri}`);
    // Attempt local or remote connection with short timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[MongoDB] Connected successfully to ${mongoose.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB Warning] Direct connection failed (${error.message}).`);
    console.log('[MongoDB] Starting embedded in-memory MongoDB server for zero-friction local execution...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      const inMemoryUri = mongoServer.getUri();
      await mongoose.connect(inMemoryUri);
      console.log(`[MongoDB] Connected successfully to In-Memory MongoDB at: ${inMemoryUri}`);
    } catch (memError) {
      console.error('[MongoDB Error] Failed to start fallback MongoDB:', memError);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (err) {
    console.error('Error disconnecting MongoDB', err);
  }
};

module.exports = { connectDB, disconnectDB };

