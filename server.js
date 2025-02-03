const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const cors = require('cors');
const errorHandler = require("./src/middlewares/errorHandler");
const cron = require("node-cron");


dotenv.config();

const app = express();

app.use(cors());

// Connect to MongoDB
connectDB();

app.use(express.json());
// Middleware for parsing JSON
app.use((req, res, next) => {
    console.log(`Incoming ${req.method} request to ${req.url}`);
    next(); // Proceed to the next middleware
});

// Schedule a task to run every minute
cron.schedule("* * * * *", () => {
  console.log("Cron job running every minute:", new Date().toLocaleString());
});


// // Define API routes
// Define API routes
app.use("/api/auth", require("./src/routes/authRoutes"));


// Error handling middleware
app.use(errorHandler);

// Define server port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


