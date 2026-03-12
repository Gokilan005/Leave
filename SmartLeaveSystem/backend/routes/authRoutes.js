const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, updateProfile, uploadProfilePicture } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/update', protect, updateProfile);
router.post('/upload-profile-picture', protect, upload.single('profileImage'), uploadProfilePicture);

module.exports = router;
