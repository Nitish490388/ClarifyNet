const express = require('express');
const passport = require('passport');
const connectDB = require('./dbConnect');
const cookieParser = require('cookie-parser');
const userRouter = require("./routes/userRoutes");
const { startSession } = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const googleRouter = require('./routes/googleRoutes');
const postRouter = require('./routes/postRoutes');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


if (process.env.NODE_ENV !== 'production') {
  require("dotenv").config({ path: './.env' });
}

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// Config
app.use(cookieParser());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CORS_URL,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

//routes
app.use("/user", userRouter);
app.use("/google", googleRouter);
app.use("/post", postRouter);

//mongodb connect
connectDB();

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
