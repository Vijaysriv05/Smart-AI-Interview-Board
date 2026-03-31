const mongoose = require('mongoose');

const applicationSchema = mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['Applied', 'Interviewing', 'Accepted', 'Rejected'],
        default: 'Applied'
    },
    resumeUrl: {
        type: String
    }
}, {
    timestamps: true
});

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
