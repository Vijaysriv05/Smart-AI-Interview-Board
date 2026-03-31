const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Auto-approve Admins for prototype purposes, others are Pending
        const status = role === 'Admin' ? 'Approved' : 'Pending';

        const user = await User.create({
            name,
            email,
            password,
            role,
            status
        });

        if (user) {
            // Cannot login immediately if pending, but we return data to handle UI state
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const authUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            
            // Check if denied or pending
            if (user.status === 'Denied') {
                return res.status(403).json({ message: 'Your account has been denied access by an Administrator.' });
            }
            if (user.status === 'Pending') {
                return res.status(401).json({ message: 'Your account is pending Administrator approval.' });
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin Endpoints for User Management
const getUsers = async (req, res) => {
    try {
        let users = await User.find({}).select('-password');
        
        // Auto-seed dummy candidates if none exist for Recommendation prototype
        const candidates = users.filter(u => u.role === 'Candidate');
        if (candidates.length === 0) {
            const seedCandidates = [
                {
                    name: "Alex Rivera",
                    email: "alex.r@example.com",
                    password: "password123",
                    role: "Candidate",
                    status: "Approved",
                    researchAreas: "Quantum Computing, Cryptography",
                    skills: "Python, C++, Qiskit",
                    education: "PhD in Physics",
                    experienceYears: 4
                },
                {
                    name: "Samantha Lee",
                    email: "sam.lee@example.com",
                    password: "password123",
                    role: "Candidate",
                    status: "Approved",
                    researchAreas: "Augmented Reality, Human-Computer Interaction",
                    skills: "Unity, C#, Swift",
                    education: "MS in CS",
                    experienceYears: 3
                }
            ];
            // Since User model uses pre-save hook for password, we use create
            await Promise.all(seedCandidates.map(c => User.create(c)));
            users = await User.find({}).select('-password');
        }
        
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                education: user.education || '',
                skills: user.skills || '',
                publications: user.publications || '',
                researchAreas: user.researchAreas || '',
                patents: user.patents || '',
                experienceYears: user.experienceYears || 0,
                organization: user.organization || '',
                bio: user.bio || ''
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const user = await User.findById(req.params.id);

        if (user) {
            await User.updateOne(
                { _id: req.params.id }, 
                { $set: { status: status } }
            );
            res.json({
                _id: user._id,
                name: user.name,
                role: user.role,
                status: status
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            // Explicitly set fields to allow clearing if provided
            if (req.body.name !== undefined) user.name = req.body.name;
            if (req.body.education !== undefined) user.education = req.body.education;
            if (req.body.skills !== undefined) user.skills = req.body.skills;
            if (req.body.publications !== undefined) user.publications = req.body.publications;
            if (req.body.researchAreas !== undefined) user.researchAreas = req.body.researchAreas;
            if (req.body.patents !== undefined) user.patents = req.body.patents;
            if (req.body.experienceYears !== undefined) user.experienceYears = req.body.experienceYears;
            if (req.body.organization !== undefined) user.organization = req.body.organization;
            if (req.body.bio !== undefined) user.bio = req.body.bio;
            
            // Password update only if provided
            if (req.body.password && req.body.password.trim() !== '') {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                status: updatedUser.status,
                education: updatedUser.education,
                skills: updatedUser.skills,
                publications: updatedUser.publications,
                researchAreas: updatedUser.researchAreas,
                patents: updatedUser.patents,
                experienceYears: updatedUser.experienceYears,
                organization: updatedUser.organization,
                bio: updatedUser.bio,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(400).json({ message: error.message || "Failed to update profile. Please ensure all required fields are valid." });
    }
};

module.exports = { registerUser, authUser, getUsers, updateUserStatus, updateUserProfile, getUserProfile };
