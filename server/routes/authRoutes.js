const express = require('express');
const router = express.Router();
const { registerUser, authUser, getUsers, updateUserStatus, updateUserProfile, getUserProfile } = require('../controllers/authController');
const { protect, admin, recruiterOrAdmin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// Admin/Recruiter accessible routes
router.route('/users')
    .get(protect, recruiterOrAdmin, getUsers);

router.route('/users/:id/status')
    .put(protect, admin, updateUserStatus);

module.exports = router;
