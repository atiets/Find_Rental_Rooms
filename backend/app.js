const mongoose = require('mongoose');
const express = require('express');
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const postRoute = require("./routes/post");
const path = require('path');

dotenv.config();
const app = express();
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true
}));


app.use(cookieParser());

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

  //ROUTE
  app.use("/v1/auth", authRoute);
  app.use("/v1/user", userRoute);
  app.use('/v1/posts', postRoute);
  // app.use('/v1/review', reviewRoute);
  // app.use('/v1/report', reportRouter);
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


  
  app.listen(8000, () => {
    console.log("Server is running")
  });