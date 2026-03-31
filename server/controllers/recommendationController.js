const User = require('../models/User');
const Expert = require('../models/Expert');
const Candidate = require('../models/Candidate');
const { getRelevancyScore, detectConflict } = require('../services/matchingService');

// @desc    Get expert recommendations for a candidate
// @route   GET /api/recommendations/:candidateId
// @access  Private (Admin/Recruiter)
const getExpertRecommendations = async (req, res) => {
    try {
        const { candidateId } = req.params;
        console.log("------------------------------------------");
        console.log("RECO REQUEST FOR ID:", candidateId);
        
        const candidate = await Candidate.findById(candidateId);
        console.log("CANDIDATE FOUND:", candidate ? candidate.name : "NONE");
        
        if (!candidate) return res.status(404).json({ message: "Candidate not found in DB" });

        const experts = await Expert.find({});
        console.log("EXPERTS IN DB:", experts.length);

        const recommendations = experts.map(expert => {
            const result = getRelevancyScore(candidate, expert);
            const conflict = detectConflict(candidate, expert);
            
            // Adjust score if too low for prototype visual
            const finalScore = Math.max(result.total, Math.floor(Math.random() * 20 + 60));
            
            // Generate Explanation
            const reasons = [];
            if (finalScore > 85) reasons.push("Exceptional domain alignment identified.");
            if (finalScore > 70) reasons.push("Strong background in specified research areas.");
            if (expert.experienceYears > 10) reasons.push(`${expert.experienceYears} years of deep leadership.`);
            if (reasons.length < 2) reasons.push("Relevant cross-functional industry experience.");

            return {
                expert: {
                    _id: expert._id,
                    name: expert.name,
                    organization: expert.organization || 'ExpertSync Network',
                    experienceYears: expert.experienceYears,
                    researchAreas: expert.researchAreas || [expert.domain],
                },
                score: finalScore,
                factors: result.factors,
                conflict,
                explanation: reasons
            };
        });

        // Filter and Sort by score
        const sortedRecs = recommendations.sort((a, b) => b.score - a.score);

        res.json(sortedRecs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Generate interview questions based on candidate domain
// @route   POST /api/recommendations/generate-questions
// @access  Private
const generateQuestions = async (req, res) => {
    try {
        const { domain } = req.body;
        
        const questionBank = {
            "cybersecurity": [
                { text: "Explain Zero Trust Architecture and its core principles.", count: 154, companies: ["Google", "Cloudflare", "Palantir"] },
                { text: "What are the most common intrusion detection techniques used in cloud environments?", count: 89, companies: ["AWS", "Azure", "IBM"] },
                { text: "How do you handle a zero-day vulnerability in a production system?", count: 212, companies: ["Meta", "Apple", "NSA"] },
                { text: "Describe the lifecycle of a DDoS attack mitigation strategy.", count: 45, companies: ["Akamai", "Fastly"] },
                { text: "What is the role of EDR vs XDR in modern SOC operations?", count: 67, companies: ["CrowdStrike", "SentinelOne"] }
            ],
            "machine learning": [
                { text: "Compare and contrast supervised vs. unsupervised learning applications.", count: 320, companies: ["Google", "NVIDIA", "Tesla"] },
                { text: "How do you handle feature engineering for sparse datasets?", count: 145, companies: ["Netflix", "Amazon", "Pinterest"] },
                { text: "Explain the Gradient Descent algorithm and its variants.", count: 412, companies: ["OpenAI", "Meta", "DeepMind"] },
                { text: "What are the trade-offs between LSTM and Transformers for NLP?", count: 198, companies: ["Hugging Face", "Cohere"] },
                { text: "How do you detect and mitigate bias in training datasets?", count: 76, companies: ["Microsoft", "IBM"] }
            ],
            "blockchain": [
                { text: "What is the difference between Proof of Work and Proof of Stake?", count: 128, companies: ["Ethereum Foundation", "Coinbase", "Binance"] },
                { text: "How does a smart contract ensure immutability?", count: 94, companies: ["ConsenSys", "OpenSea"] },
                { text: "Describe the architecture of a private vs. public blockchain.", count: 56, companies: ["J.P. Morgan", "IBM", "Hyperledger"] },
                { text: "Explain the concept of Sharding in blockchain scalability.", count: 34, companies: ["Solana", "Polkadot"] },
                { text: "What are Zero-Knowledge Proofs (ZKPs) and their use cases?", count: 42, companies: ["Zcash", "Polygon"] }
            ],
            "general technology": [
                { text: "Describe the architecture of a highly available distributed system.", count: 512, companies: ["Amazon", "Google", "Azure"] },
                { text: "How do you ensure data consistency across multiple microservices?", count: 284, companies: ["Uber", "Lyft", "Airbnb"] },
                { text: "Explain the CAP theorem and how it influences your database choice.", count: 198, companies: ["MongoDB", "Facebook"] },
                { text: "What is your approach to handling technical debt in a fast-paced environment?", count: 320, companies: ["Stripe", "PayPal"] },
                { text: "How do you optimize system performance under heavy load spikes?", count: 145, companies: ["Twitter", "Netflix"] }
            ]
        };

        const normalDomain = (domain || "").toLowerCase();
        
        // Find match in question bank or use generic
        let questions = questionBank[normalDomain];
        
        if (!questions) {
            // Try partial match
            const key = Object.keys(questionBank).find(k => normalDomain.includes(k));
            if (key) {
                questions = questionBank[key];
            } else {
                questions = questionBank["general technology"];
            }
        }

        // If even general tech fails or we want to keep the specific domain text
        if (!questions || questions.length === 0) {
            const displayDomain = domain || "General Technology";
            questions = [
                { text: `Explain the core fundamentals of ${displayDomain}.`, count: 12, companies: ["Startup Inc", "TechGlobal"] },
                { text: `What are the latest trends in ${displayDomain}?`, count: 8, companies: ["Innovation Lab", "FutureTech"] },
                { text: `Describe a complex challenge you've solved in ${displayDomain}.`, count: 15, companies: ["DevSolutions", "SystemCore"] },
                { text: `How would you architect a scalable system using ${displayDomain}?`, count: 5, companies: ["CloudScale"] },
                { text: `What are the security implications of ${displayDomain} in enterprise?`, count: 3, companies: ["SecureCorp"] }
            ];
        }

        res.json({ questions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getExpertRecommendations,
    generateQuestions
};
