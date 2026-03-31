const Candidate = require('../models/Candidate');

const createCandidate = async (req, res) => {
    try {
        const candidate = new Candidate(req.body);
        const savedCandidate = await candidate.save();
        res.status(201).json(savedCandidate);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find({});
        res.json(candidates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCandidateById = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (candidate) {
            res.json(candidate);
        } else {
            res.status(404).json({ message: 'Candidate not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (candidate) {
            await Candidate.deleteOne({ _id: req.params.id });
            res.json({ message: 'Candidate removed' });
        } else {
            res.status(404).json({ message: 'Candidate not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCandidate,
    getCandidates,
    getCandidateById,
    deleteCandidate
};
