const Expert = require('../models/Expert');

const createExpert = async (req, res) => {
    try {
        const expert = new Expert(req.body);
        const savedExpert = await expert.save();
        res.status(201).json(savedExpert);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getExperts = async (req, res) => {
    try {
        let experts = await Expert.find({});
        
        // Auto-seed detailed experts if collection is empty
        if (experts.length === 0) {
            const seedExperts = [
                {
                    name: "Dr. Sarah Chen",
                    email: "s.chen@mit.edu",
                    domain: "Natural Language Processing",
                    experienceYears: 12,
                    organization: "MIT CSAIL",
                    researchAreas: ["Large Language Models", "Semantic Analysis", "Zero-shot Learning"],
                    publications: ["Attention is All You Need: A Retrospective", "Efficient Transformers for Neural Matching"],
                    patents: ["US1029384 - Neural Context Preservation"]
                },
                {
                    name: "Prof. Marcus Thorne",
                    email: "m.thorne@stanford.edu",
                    domain: "Cybersecurity & AI",
                    experienceYears: 18,
                    organization: "Stanford AI Lab",
                    researchAreas: ["Adversarial Machine Learning", "Network Security", "Encrypted Inference"],
                    publications: ["Defending Neural Networks from Input Perturbations"],
                    patents: ["US2938475 - Encrypted Data Classification"]
                },
                {
                    name: "James Rodriguez",
                    email: "james.r@dataflow.io",
                    domain: "MLOps Infrastructure",
                    experienceYears: 10,
                    organization: "DataFlow Systems",
                    researchAreas: ["Kubernetes for ML", "Data Lineage", "Scalable Training Pipelines"],
                    publications: ["Scaling MLOps in Production Environments"],
                    patents: ["US1102938 - Automated Hyperparameter Tuning at Scale"]
                }
            ];
            await Expert.insertMany(seedExperts);
            experts = await Expert.find({});
        }
        
        res.json(experts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getExpertById = async (req, res) => {
    try {
        const expert = await Expert.findById(req.params.id);
        if (expert) {
            res.json(expert);
        } else {
            res.status(404).json({ message: 'Expert not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFeaturedExperts = async (req, res) => {
    try {
        const experts = await Expert.find({}).limit(3);
        res.json(experts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteExpert = async (req, res) => {
    try {
        const expert = await Expert.findById(req.params.id);
        if (expert) {
            await Expert.deleteOne({ _id: req.params.id });
            res.json({ message: 'Expert removed' });
        } else {
            res.status(404).json({ message: 'Expert not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateExpert = async (req, res) => {
    try {
        const expert = await Expert.findById(req.params.id);
        if (expert) {
            expert.name = req.body.name || expert.name;
            expert.status = req.body.status || expert.status;
            expert.domain = req.body.domain || expert.domain;
            expert.bio = req.body.bio || expert.bio;
            
            const updatedExpert = await expert.save();
            res.json(updatedExpert);
        } else {
            res.status(404).json({ message: 'Expert not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createExpert,
    getExperts,
    getExpertById,
    getFeaturedExperts,
    deleteExpert,
    updateExpert
};
