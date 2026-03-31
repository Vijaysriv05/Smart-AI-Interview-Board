const mongoose = require('mongoose');

const candidateSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String
    },
    education: {
        type: String
    },
    researchAreas: [{
        type: String
    }],
    skills: [{
        type: String
    }],
    publications: [{
        title: String,
        description: String,
        link: String
    }],
    resumeUrl: {
        type: String
    }
}, {
    timestamps: true
});

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;
