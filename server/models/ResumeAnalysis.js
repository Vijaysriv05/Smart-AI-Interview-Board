const mongoose = require('mongoose');

const resumeAnalysisSchema = mongoose.Schema({
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    score: Number,
    keywords: [String],
    missing: [String],
    recommendations: String,
    filename: String
}, {
    timestamps: true
});

const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
module.exports = ResumeAnalysis;
