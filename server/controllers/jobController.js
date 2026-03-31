const Job = require('../models/Job');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
    try {
        // Ensure standard mock jobs are seeded (upsert them)
        const seedJobs = [
            { _id: '65e9f1a2b3c4d5e6f7a8b9c0', title: "Senior AI Engineer", company: "DeepInsights AI", location: "San Francisco / Remote", salary: "$160k - $210k", description: "Lead AI development using Transformers and PyTorch.", tags: ["NLP", "PyTorch", "Transformers"], match: 96 },
            { _id: '65e9f1a2b3c4d5e6f7a8b9c1', title: "Machine Learning Lead", company: "DataFlow Systems", location: "New York, NY", salary: "$145k - $190k", description: "Design MLOps pipelines and oversee data modeling.", tags: ["Scikit-learn", "MLOps", "Azure"], match: 88 },
            { _id: '65e9f1a2b3c4d5e6f7a8b9c2', title: "Frontend Developer (React)", company: "WebScale Solutions", location: "Remote", salary: "$120k - $160k", description: "Build high-performance UIs using React and Tailwind.", tags: ["React", "Tailwind", "TypeScript"], match: 82 }
        ];

        for (const seed of seedJobs) {
            await Job.findByIdAndUpdate(seed._id, seed, { upsert: true, new: true, setDefaultsOnInsert: true });
        }

        const jobs = await Job.find({});
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a job (Recruiter/Admin only)
// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res) => {
    try {
        const { title, company, location, salary, description, skills } = req.body;
        const job = await Job.create({
            title,
            company,
            location,
            salary,
            description,
            skills,
            postedBy: req.user._id
        });
        res.status(201).json(job);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (job) {
            await Job.deleteOne({ _id: req.params.id });
            res.json({ message: 'Job removed' });
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getJobs, createJob, deleteJob };
