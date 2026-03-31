const express = require('express');
const router = express.Router();
const { applyToJob, getMyApplications } = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, applyToJob);

router.route('/me')
    .get(protect, getMyApplications);

module.exports = router;
