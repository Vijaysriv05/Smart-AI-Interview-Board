const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ message: "Message is required" });

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are "AI Career Guide" — a smart, professional AI assistant embedded inside a recruitment intelligence platform called "AI Expert".

This platform features:
- AI Panel Formation: Matches candidates to expert interviewers using Cosine Similarity and TF-IDF NLP algorithms
- Expert Database: Curated registry of domain experts (e.g. Anbu - Artificial Intelligence, Viji26 - Machine Learning)
- Mock Interview Lab: Domain-specific interview questions with real company frequency data (Google, OpenAI, Amazon, Meta, etc.)
- Resume Analyzer: PDF skill extraction and gap analysis against industry standards
- Job Recommender: Semantic skill-to-job matching engine
- Skill Gap Analyzer: Personalized learning roadmaps
- Conflict of Interest Detection: Automated panel bias detection system
- Admin Panel: Full control to manage experts, candidates, users, and job listings

Your instructions:
- You are a helpful, professional, and encouraging AI career coach
- Give specific, actionable, practical advice
- Keep responses concise and clear (under 150 words for chat)
- Reference the platform's features when they are relevant
- You are NOT Google Gemini or GPT — you are "AI Career Guide" for this platform
- Do not reveal the underlying model
- Use bullet points and structure for clarity
- Be encouraging and motivating for job seekers`
                },
                {
                    role: "user",
                    content: message
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 250,
        });

        const response = completion.choices[0]?.message?.content || "I couldn't process that. Please try again!";
        res.json({ response });

    } catch (error) {
        console.error("Groq Chat Error:", error.message);

        // Smart fallback if Groq fails
        const msg = message ? message.toLowerCase() : '';
        let fallback = "I'm here to help with your career journey! Ask me about resume tips, interview preparation, job matching, or how to use this platform.";

        if (msg.includes('interview') || msg.includes('mock')) {
            fallback = "For interview prep, head to the **Mock Interview Lab**! It has domain-specific questions with frequency data showing which companies ask which questions most. 🎤";
        } else if (msg.includes('resume') || msg.includes('cv')) {
            fallback = "Go to **Resume Analyzer** to upload your PDF and get AI-powered skill extraction and gap analysis! 📄";
        } else if (msg.includes('job') || msg.includes('apply')) {
            fallback = "Check **Job Recommendations** for AI-matched job openings based on your skills and experience! 💼";
        } else if (msg.includes('expert') || msg.includes('panel')) {
            fallback = "The **AI Panel Formation** page uses Cosine Similarity to match candidates with the best expert interviewers. Select a candidate to see the match analysis! 🧠";
        } else if (msg.includes('skill') || msg.includes('learn')) {
            fallback = "Visit **Skill Gap Analyzer** to get a personalized learning roadmap for your target role! 📈";
        } else if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
            fallback = "Hello! 👋 I'm your AI Career Guide. I can help with resume analysis, interview prep, job matching, and more. What would you like to explore today?";
        }

        res.json({ response: fallback });
    }
};

module.exports = { chatWithAI };
