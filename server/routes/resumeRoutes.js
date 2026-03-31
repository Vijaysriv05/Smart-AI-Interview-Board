const express = require('express');
const router = express.Router();
const { analyzeResume, getLatestAnalysis } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, analyzeResume);

router.route('/latest')
    .get(protect, getLatestAnalysis);

module.exports = router;
