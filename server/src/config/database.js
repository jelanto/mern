import mongoose from 'mongoose';
import dns from 'dns';

// Fix Windows Node DNS SRV lookup for MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore in restricted environments
}

let isConnected = false;

export const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/finflow';

  try {
    mongoose.set('strictQuery', true);
    
    // Set connection options
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(`[FinFlow Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    isConnected = false;
    console.warn(`[FinFlow Database Warning] Unable to connect to MongoDB at ${mongoUri}.`);
    console.warn(`[FinFlow Database Info] Error: ${error.message}`);
    console.warn(`[FinFlow Database Info] To enable full database persistence, ensure MongoDB is running locally or set MONGODB_URI in server/.env to your MongoDB Atlas connection string.`);
    console.warn(`[FinFlow Database Info] Server is running with health check and graceful fallback capability.`);
    return null;
  }
};

export const getDbStatus = () => {
  return {
    connected: isConnected && mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
  };
};

export default connectDatabase;
