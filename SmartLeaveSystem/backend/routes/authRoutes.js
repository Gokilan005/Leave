const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, updateProfile, sendTestEmail } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/update', protect, updateProfile);
router.post('/test-email', sendTestEmail);

module.exports = router;

