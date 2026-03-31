const express = require('express');
const router = express.Router();
const { saveInterviewSession, getLatestInterview } = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, saveInterviewSession);

router.route('/latest')
    .get(protect, getLatestInterview);

module.exports = router;
