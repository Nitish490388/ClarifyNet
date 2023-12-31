
const allowedCharactersRegex = /^[a-zA-Z0-9-_]+$/;
const Otp = require('../models/otpModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");


///utility functions///
const generateOTP = () => {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
///////////////////////

const signup = async (req, res) => {
  try {
    const { username, email, password, otp } = req.body;
    if (!username || !email || !password || !otp) {
      return res.status(400).send({ message: "all fields are required" });
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).send({ message: "user already exists" });
    }
    if (username.length > 20 || username.length < 3) {
      return res.status(400).send({ message: "Invalid username length" });
    }
    const existingUserName = await User.findOne({ username: username });
    if (existingUserName) {
      return res.status(400).send({
        message: "Username already exists",
      });
    }
    if (!allowedCharactersRegex.test(username)) {
      return res
        .status(400)
        .send({ message: "Invalid characters in username." });
    }
    const correctOtp = await Otp.findOne({ email: email });
    if (!correctOtp) {
      return res.status(400).send({ message: "OTP not found or invalid!" });
    }
    if (correctOtp.otp !== otp) {
      return res.status(400).send({
        message: "OTP not found or invalid!",
        correctOtp: correctOtp,
        otp: otp,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });
    const token = jwt.sign({ email: email, _id: user._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("token", token, {
      path: "/",
      sameSite: "lax",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 24 * 60 * 60),
    });
    return res.status(200).send({
      user: {
        email: user.email,
        username: user.username,
        picture: user.picture,
        upvotedPosts: user.upvotedPosts,
      },
    });

  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send({ message: "All fields are required!" });
    }
    if (username.includes("@")) {
      var existingUser = await User.findOne({ email: username });
    } else {
      var existingUser = await User.findOne({ username: username });
    }
    if (!existingUser) {
      return res
        .status(400)
        .send({ message: "Password or email didn't matched!" });
    }
    const matchedPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchedPassword) {
      return res
        .status(400)
        .send({ message: "Password or email didn't matched!" });
    }
    const token = jwt.sign(
      { username: username, _id: existingUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("token", token, {
      path: "/",
      sameSite: "lax",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 24 * 60 * 60),
    });
    return res.status(200).send({
      user: {
        email: existingUser.email,
        username: existingUser.username,
        picture: existingUser.picture,
        upvotedPosts: existingUser.upvotedPosts,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    req.session = null;
    return res.status(200).send({ message: "Logged out!" });
  } catch (error) {
    return res.status(500).send({ message: "Error logging out!" });
  }

}

const sendOTP = async (req, res) => {
  const { email, username } = req.body;
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_ID,
      pass: process.env.GMAIL_PASS,
    },
  })
  if (!email) {
    return res.status(400).send({ message: "Invalid email !" });
  }
  try {
    const existingUser = await User.findOne({ email: email });
    const existingUsername = await User.findOne({ username: username });
    if (existingUsername) {
      return res.status(400).send({ message: "Username already exists" });
    }

    if (existingUser) {
      return res.status(400).send({ message: "This user already exists." });
    }
    if (username.length < 3 || username.length > 20) {
      return res.status(400).send({ message: "Username length invalid." });
    }

    if (!allowedCharactersRegex.test(username)) {
      return res
        .status(400)
        .send({ message: "Invalid characters in username." });
    }

    const generatedOTP = generateOTP();

    await transporter.sendMail({
      from: '"ClarifyNet" <jenanitish490@gmail.com>',
      to: email,
      subject: "ClarifyNet",
      text: `Your OTP for Clarifynet: ${generatedOTP}`,
      html: `<h1>Your OTP for ClarifyNet: ${generatedOTP}</h1>`,
    });

    await Otp.findOneAndUpdate(
      { email: email },
      { email: email, otp: generatedOTP },
      { upsert: true, new: true }
    );
    return res.status(200).send({ message: "OTP Sent !" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "OTP Couldn't be sent, try again!" });
  }
}

module.exports = {
  signup,
  login,
  logout,
  sendOTP,
};
