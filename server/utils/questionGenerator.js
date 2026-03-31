const generateQuestions = (candidateDomainKeywords) => {
    // Array of mock company names for randomization
    const companies = ["Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Oracle"];

    const getRandomCompany = () => companies[Math.floor(Math.random() * companies.length)];
    const getRandomFrequency = () => Math.floor(Math.random() * 200) + 15; // Random number between 15 and 215

    // A map of domains to common questions
    const questionBank = {
        'machine learning': [
            "Can you explain the difference between supervised and unsupervised learning?",
            "What is overfitting, and how do you prevent it?",
            "Explain how an LSTM network handles sequence data."
        ],
        'nlp': [
            "How does TF-IDF work?",
            "Can you explain the Transformer architecture?",
            "What are the challenges of handling out-of-vocabulary words?"
        ],
        'cybersecurity': [
            "Explain Zero Trust Architecture.",
            "What are common intrusion detection techniques?",
            "How would you secure a RESTful API?"
        ],
        'web development': [
            "Explain the virtual DOM in React.",
            "How do you optimize the performance of a modern web application?",
            "What are the differences between SQL and NoSQL databases?"
        ]
    };

    let selectedQuestionsText = [];
    let textMatch = (candidateDomainKeywords || "").toLowerCase();

    Object.keys(questionBank).forEach(domain => {
        if (textMatch.includes(domain) || domain.includes(textMatch)) {
            selectedQuestionsText = selectedQuestionsText.concat(questionBank[domain]);
        }
    });

    // Fallback if no specific domain matched
    if (selectedQuestionsText.length === 0) {
        selectedQuestionsText = [
            "Can you walk us through your most significant project?",
            "What were the biggest technical challenges you faced recently?",
            "How do you keep your skills updated and learn new technologies?"
        ];
    }

    // Map the selected text strings into full rich objects with company data
    let richQuestions = selectedQuestionsText.map(qText => {
        return {
            question: qText,
            company: getRandomCompany(),
            frequency: getRandomFrequency()
        };
    });

    return richQuestions.slice(0, 3); // Return top 3 questions
};

module.exports = { generateQuestions };
