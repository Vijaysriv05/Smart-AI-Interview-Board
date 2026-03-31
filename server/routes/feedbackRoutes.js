const express = require('express');
const router = express.Router();
const { submitFeedback, getAllFeedback, deleteFeedback } = require('../controllers/feedbackController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getAllFeedback)
    .post(protect, submitFeedback);

router.route('/:id')
    .delete(protect, admin, deleteFeedback);

module.exports = router;
