const ResumeAnalysis = require('../models/ResumeAnalysis');

// @desc    Analyze resume and save results
// @route   POST /api/resume-analysis
// @access  Private (Candidate)
const analyzeResume = async (req, res) => {
    try {
        const { filename } = req.body;
        
        // Simulate AI Scoring Logic
        const score = Math.floor(Math.random() * (95 - 70 + 1)) + 70;
        const keywords = ["React", "Node.js", "MongoDB", "Cloud Architect", "Frontend"];
        const missing = ["Docker", "Kubernetes", "Microservices"];
        const recommendations = "Focus on containerization and orchestration to match senior AI infrastructure roles.";

        const analysis = await ResumeAnalysis.create({
            candidate: req.user._id,
            score,
            keywords,
            missing,
            recommendations,
            filename
        });

        res.status(201).json(analysis);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get my latest analysis
// @route   GET /api/resume-analysis/latest
// @access  Private (Candidate)
const getLatestAnalysis = async (req, res) => {
    try {
        const analysis = await ResumeAnalysis.findOne({ candidate: req.user._id })
            .sort({ createdAt: -1 });
        res.json(analysis);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { analyzeResume, getLatestAnalysis };
