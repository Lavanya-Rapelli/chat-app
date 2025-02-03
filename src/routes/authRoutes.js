const express = require('express');
const { registerUser, loginUser, forgotPassword, resetPassword, logoutUser } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware'); 
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/logout', protect, logoutUser);

module.exports = router;



