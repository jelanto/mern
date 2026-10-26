import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDatabase } from './config/database.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Attempt Database connection
  await connectDatabase();

  const server = app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`  FinFlow Backend Server is running on port: ${PORT}`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`  Health Check: http://localhost:${PORT}/api/health`);
    console.log(`======================================================\n`);
  });

  // Handle Unhandled Promise Rejections
  process.on('unhandledRejection', (err) => {
    console.error(`[FinFlow Server Error] Unhandled Rejection: ${err.message}`);
  });

  // Handle SIGTERM/SIGINT
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });
};

startServer();
