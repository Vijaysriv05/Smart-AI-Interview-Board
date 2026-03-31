const Feedback = require('../models/Feedback');

// @desc    Submit new feedback
// @route   POST /api/feedback
// @access  Private
const submitFeedback = async (req, res) => {
    try {
        const { content, rating } = req.body;
        
        const feedback = await Feedback.create({
            user: req.user._id,
            userName: req.user.name,
            userRole: req.user.role,
            content,
            rating
        });

        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Private/Admin
const getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find({}).sort({ createdAt: -1 });
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (feedback) {
            await Feedback.deleteOne({ _id: req.params.id });
            res.json({ message: 'Feedback removed' });
        } else {
            res.status(404).json({ message: 'Feedback not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    submitFeedback,
    getAllFeedback,
    deleteFeedback
};
