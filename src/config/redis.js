// Load environment variables from the .env file
require('dotenv').config();

// Import the Redis library
const redis = require('redis');

// Get the Redis URI from the environment variables
const REDIS_URI = process.env.REDIS_URI;

// Create a Redis client
const client = redis.createClient({
  url: REDIS_URI,
});

// Connect to Redis
client.connect();

// Handle Redis connection events
client.on('connect', () => {
  console.log('Connected to Redis');
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

// Export the Redis client
module.exports = client;
