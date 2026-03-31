const InterviewSession = require('../models/InterviewSession');

// @desc    Save interview session
// @route   POST /api/interviews
// @access  Private
const saveInterviewSession = async (req, res) => {
    try {
        const { questions, responses } = req.body;
        
        // Simulate AI Grading
        const score = Math.floor(Math.random() * (90 - 60 + 1)) + 60;
        const feedback = "Good technical depth. Work on shortening your system design explanations for better clarity.";

        const session = await InterviewSession.create({
            candidate: req.user._id,
            questions,
            responses,
            score,
            feedback
        });

        res.status(201).json(session);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get latest session
// @route   GET /api/interviews/latest
// @access  Private
const getLatestInterview = async (req, res) => {
    try {
        const session = await InterviewSession.findOne({ candidate: req.user._id })
            .sort({ createdAt: -1 });
        res.json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { saveInterviewSession, getLatestInterview };
