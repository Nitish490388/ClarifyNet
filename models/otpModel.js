const mongoose = require("mongoose");

const OtpSchema = mongoose.Schema({
  otp: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 300,
    default: Date.now,
  }
});

const Otp = mongoose.model("Otp", OtpSchema);
module.exports = Otp;