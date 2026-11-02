const mongoose = require('mongoose');

/**
 * Connect to MongoDB Atlas or local MongoDB instance using Mongoose.
 * Retrieves connection string securely from environment variables.
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error(
        'MONGODB_URI is not defined in the environment variables. Please check your .env file.'
      );
    }

    // Connect to MongoDB
    const conn = await mongoose.connect(mongoURI);

    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    // Exit process with failure in production/standalone server
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    } else {
      throw error;
    }
  }
};

module.exports = connectDB;
