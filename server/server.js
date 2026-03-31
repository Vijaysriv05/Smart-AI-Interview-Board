const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/candidates', require('./routes/candidateRoutes'));
app.use('/api/experts', require('./routes/expertRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/resume-analysis', require('./routes/resumeRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/interviews', require('./routes/interviewRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
