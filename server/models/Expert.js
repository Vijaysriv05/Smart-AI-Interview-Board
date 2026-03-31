const mongoose = require('mongoose');

const expertSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    domain: {
        type: String,
        required: true
    },
    researchAreas: [{
        type: String
    }],
    publications: [{
        type: String
    }],
    patents: [{
        type: String
    }],
    experienceYears: {
        type: Number,
        default: 0
    },
    organization: {
        type: String
    },
    status: {
        type: String,
        enum: ['Available', 'Not Available'],
        default: 'Available'
    }
}, {
    timestamps: true
});

const Expert = mongoose.model('Expert', expertSchema);
module.exports = Expert;
