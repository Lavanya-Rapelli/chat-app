const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');
const { getCache, setCache, deleteCache } = require('../services/cacheMiddleware.js');

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if the user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create a new user instance
  const user = new User({
    name,
    email,
    password,
  });

  // Save the user to the database
  await user.save();

  // Invalidate cache for any related user data
  await deleteCache(`user:${email}`);

  // Send a response
  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if data is in cache
  const cacheKey = `user:${email}`;
  const cachedUser = await getCache(cacheKey);
  if (cachedUser) {
    return res.status(200).json({
      message: 'Success (from cache)',
      token: cachedUser.token,
      user: {
        id: cachedUser.id,
        name: cachedUser.name,
        email: cachedUser.email,
      },
    });
  }

  // Check if the user exists
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error('User not found');
  }

  // Compare password with hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(400);
    throw new Error('Invalid credentials');
  }

  // Create a JWT token
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  // Store user data in Redis cache for 30 days
  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    token: token,
  };
  await setCache(cacheKey, userData, 2592000); // Cache for 30 days

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

// Forgot Password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Find the user
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error('User not found');
  }

  // Generate a password reset token (1 hour expiry)
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiration = Date.now() + 3600000;  // 1 hour expiration time

  // Save the reset token and expiration time in the user's document
  user.resetToken = resetToken;
  user.resetTokenExpiration = resetTokenExpiration;
  await user.save();

  // Set up the transporter using credentials from .env
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,  // Get email from .env
      pass: process.env.EMAIL_PASS,  // Get email password from .env
    },
  });

  // Setup email data
  const mailOptions = {
    from: process.env.EMAIL_USER,  // Use email from .env
    to: email,
    subject: 'Password Reset Request',
    text: `You requested a password reset. Click the following link to reset your password:\n\nhttp://localhost:5000/api/auth/reset-password/${resetToken}\n\nThis link will expire in 1 hour.`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: 'Error sending email', error });
    }
    res.json({ message: 'Password reset email sent successfully' });
  });
});

// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  // Find the user based on the token and check if it's expired
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },  // Token is valid only if expiration time is greater than now
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired token');
  }

  // Hash the new password before saving
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  // Clear the reset token and expiration time
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;

  // Save the user with the new password
  await user.save();

  res.json({ message: 'Password reset successfully' });
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  // Clear the token in a real-world scenario by removing it from the frontend or storing a blacklist
  res.json({ message: 'User logged out successfully' });
});

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  logoutUser,
};
