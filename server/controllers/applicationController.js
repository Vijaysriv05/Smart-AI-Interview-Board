const Application = require('../models/Application');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (Candidate)
const applyToJob = async (req, res) => {
    try {
        const { jobId, resumeUrl } = req.body;
        console.log(`Application attempt: User ${req.user._id} for Job ${jobId}`);
        
        if (!jobId) {
            return res.status(400).json({ message: "Job ID is required" });
        }

        const existingApp = await Application.findOne({ job: jobId, candidate: req.user._id });
        if (existingApp) {
            return res.status(400).json({ message: "You have already applied for this job." });
        }

        const application = await Application.create({
            job: jobId,
            candidate: req.user._id,
            resumeUrl: resumeUrl || ""
        });
        
        console.log(`Application created: ${application._id}`);
        res.status(201).json(application);
    } catch (error) {
        console.error("Application Error:", error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get my applications
// @route   GET /api/applications/me
// @access  Private (Candidate)
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ candidate: req.user._id })
            .populate('job', 'title company location');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { applyToJob, getMyApplications };
