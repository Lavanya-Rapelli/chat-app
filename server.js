const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const cors = require('cors');
const errorHandler = require('./src/middlewares/errorHandler');
const cron = require('node-cron');
const path = require('path'); // Add this line to use path

dotenv.config();

const app = express();

app.use(cors());

connectDB();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public'))); // This line serves static files

app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.url}`);
  next(); 
});

cron.schedule("* * * * *", () => {
  console.log("Cron job running every minute:", new Date().toLocaleString());
});

app.use("/api/auth", require("./src/routes/authRoutes"));



app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
