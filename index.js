const express = require('express');
const passport = require('passport');
const connectDB = require('./dbConnect');
const cookieParser = require('cookie-parser');
const userRouter = require("./routes/userRoutes");
const { startSession } = require('mongoose');

if (process.env.NODE_ENV !== 'production') {
  require("dotenv").config({ path: './.env' });
}

const app = express();

app.use(passport.initialize());
app.use(passport.session());

// Config
app.use(cookieParser());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/user", userRouter);


//mongodb connect
connectDB();

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
