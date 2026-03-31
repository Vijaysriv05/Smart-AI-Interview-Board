const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Job = require('./models/Job');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedData = async () => {
    try {
        await Job.deleteMany();
        
        const jobs = [
            {
                title: "Senior Full Stack Developer",
                company: "TechNexus Blue",
                location: "Remote / New York",
                salary: "$130k - $170k",
                description: "Looking for an expert in React and Node.js to lead our core products.",
                skills: "React, Node.js, MongoDB, AWS",
                tags: ["React", "Node.js", "Lead"],
                match: 95
            },
            {
                title: "AI Research Engineer",
                company: "Innovate AI",
                location: "San Francisco, CA",
                salary: "$180k - $240k",
                description: "Work on cutting-edge LLMs and agentic systems.",
                skills: "Python, PyTorch, LLMs, NLP",
                tags: ["AI", "Python", "Research"],
                match: 88
            },
            {
                title: "Junior Frontend Developer",
                company: "StartUp Inc",
                location: "Austin, TX",
                salary: "$80k - $100k",
                description: "Join our fast-paced team building modern web interfaces.",
                skills: "HTML, CSS, JavaScript, Tailwind",
                tags: ["Frontend", "Junior"],
                match: 72
            }
        ];

        await Job.insertMany(jobs);
        console.log("Database Seeded Successfully!");
        process.exit();
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedData();
