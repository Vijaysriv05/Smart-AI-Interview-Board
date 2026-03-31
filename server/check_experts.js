const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Expert = require('./models/Expert');

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");
        
        const count = await Expert.countDocuments();
        if (count === 0) {
            console.log("Seeding experts...");
            await Expert.insertMany([
                {
                    name: "ANBU",
                    email: "anbu@expertsync.io",
                    domain: "ARTIFICIAL INTELLIGENCE",
                    organization: "ExpertSync Lead",
                    experienceYears: 12,
                    researchAreas: ["Neural Networks", "Deep Learning", "Generative AI"]
                },
                {
                    name: "VIJI26",
                    email: "viji26@expertsync.io",
                    domain: "MACHINE LEARNING",
                    organization: "Senior Domain Expert",
                    experienceYears: 15,
                    researchAreas: ["Predictive Modeling", "Big Data", "Transformer Architectures"]
                }
            ]);
            console.log("Seeded successfully");
        } else {
            console.log(`Found ${count} experts. No seeding needed.`);
            const experts = await Expert.find({});
            console.log(JSON.stringify(experts, null, 2));
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
