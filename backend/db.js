const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.warn('⚠️ Database connection failed. Running in Stateless Mode.');
    // process.exit(1);
  }
};

module.exports = connectDB;
