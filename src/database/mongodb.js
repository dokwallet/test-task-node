const mongoose = require('mongoose');
const { APIError } = require('../utils/error');

async function initializeDB() {
  try {
    const mongoDBUrl = process.env.MONGO_DB_URL;
    mongoose.connection.close();
    return await mongoose.connect(mongoDBUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      poolSize: 25,
      maxPoolSize: 25,
    });
  } catch (err) {
    console.error('Error in connection of MongoDB:', err);
    throw new APIError(500, err?.message, null, err?.stack);
  }
}

module.exports = {
  initializeDB,
};
