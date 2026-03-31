const mongoose = require('mongoose');

const interviewSessionSchema = mongoose.Schema({
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questions: [String],
    responses: [String],
    score: Number,
    feedback: String
}, {
    timestamps: true
});

const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);
module.exports = InterviewSession;
