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
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      family: 4,
      maxPoolSize: 10,
    });

    isConnected = true;
    console.log(`[FinFlow Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      console.warn('[FinFlow Database Warning] MongoDB disconnected. Attempting automatic reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      isConnected = true;
      console.log('[FinFlow Database] MongoDB reconnected successfully.');
    });

    return conn;
  } catch (error) {
    isConnected = false;
    console.warn(`[FinFlow Database Warning] Unable to connect to MongoDB: ${error.message}`);
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
