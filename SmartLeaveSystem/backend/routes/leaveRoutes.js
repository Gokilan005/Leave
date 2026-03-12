const express = require('express');
const router = express.Router();
const { applyLeave, getLeaves, updateLeaveStatus } = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('student'), applyLeave);
router.get('/', protect, getLeaves);
router.put('/:id/status', protect, authorize('hod', 'advisor', 'admin'), updateLeaveStatus);

module.exports = router;
