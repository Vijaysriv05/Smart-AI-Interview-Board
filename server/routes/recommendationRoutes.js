const express = require('express');
const router = express.Router();
const { getExpertRecommendations, generateQuestions } = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:candidateId', protect, getExpertRecommendations);
router.post('/generate-questions', protect, generateQuestions);

module.exports = router;
