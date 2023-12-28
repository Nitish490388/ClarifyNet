const express = require("express");
const {
  signup,
  login,
  logout,
  sendOTP
} = require("../controllers/userController");

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.post("/sendOTP", sendOTP);

module.exports = userRouter;