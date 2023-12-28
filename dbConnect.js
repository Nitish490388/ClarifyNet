const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    const DB_CONFIG = {
      dbName: "ClarifyNet",
    }

    await mongoose.connect(uri, DB_CONFIG);
  } catch (error) {
    console.log(error)
  }
}

module.exports = connectDB;