const natural = require('natural');
const TfIdf = natural.TfIdf;

// Tokenizer & Stemmer
const tokenizer = new natural.WordTokenizer();

// Helper to extract texts
const extractKeywords = (textArray) => {
    if (!textArray || textArray.length === 0) return '';
    return textArray.join(' ').toLowerCase();
};

// Calculate cosine similarity between two string paragraphs
const calculateCosineSimilarity = (text1, text2) => {
    const tfidf = new TfIdf();
    tfidf.addDocument(text1);
    tfidf.addDocument(text2);
    
    // Simplistic Cosine approach: using shared terms tfidf score
    // A better approach using vectors:
    const vec1 = {};
    const vec2 = {};
    
    // We can use a simpler approach since natural TFIDF is doc based:
    // Let's build a set of all unique words
    const words1 = tokenizer.tokenize(text1) || [];
    const words2 = tokenizer.tokenize(text2) || [];
    const allWords = Array.from(new Set([...words1, ...words2]));

    if (allWords.length === 0) return 0;
    
    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;

    allWords.forEach(word => {
        // Simple term frequency for text1 and text2
        let count1 = words1.filter(w => w === word).length;
        let count2 = words2.filter(w => w === word).length;
        
        dotProduct += (count1 * count2);
        mag1 += (count1 * count1);
        mag2 += (count2 * count2);
    });

    mag1 = Math.sqrt(mag1);
    mag2 = Math.sqrt(mag2);

    if (mag1 === 0 || mag2 === 0) return 0;
    
    return dotProduct / (mag1 * mag2);
};

// Scoring Algorithm
// Relevancy Score = 0.4*Skill + 0.3*Pubs + 0.2*Exp + 0.1*Domain
const matchCandidateToExpert = (candidate, expert) => {
    // Skills vs Expert Domain/Research
    const candidateSkillsText = extractKeywords(candidate.skills || []);
    const expertResearchText = extractKeywords(expert.researchAreas || []) + ' ' + (expert.domain || '');
    let skillMatch = calculateCosineSimilarity(candidateSkillsText, expertResearchText);

    // Pubs vs Pubs
    const candidatePubsText = (candidate.publications || []).map(p => p.title + ' ' + p.description).join(' ');
    const expertPubsText = (expert.publications || []).map(p => p.title + ' ' + p.description).join(' ');
    let pubSimilarity = calculateCosineSimilarity(candidatePubsText, expertPubsText);
    
    // Experience Match (Cap at 1.0)
    // Assume 10 years is max expected relevance marker for full score here
    let expMatch = Math.min((expert.experienceYears || 0) / 10.0, 1.0);

    // Domain overlap
    const candidateResearchText = extractKeywords(candidate.researchAreas || []);
    let domainOverlap = calculateCosineSimilarity(candidateResearchText, expertResearchText);

    let relevancyScore = (0.4 * skillMatch) + (0.3 * pubSimilarity) + (0.2 * expMatch) + (0.1 * domainOverlap);
    
    // Bias Detection / Conflict Of Interest
    let conflictFlag = false;
    let conflictReason = null;
    let scorePenalty = 0;

    // e.g., candidate education vs expert organization
    if (candidate.education && expert.organization) {
        if (candidate.education.toLowerCase().includes(expert.organization.toLowerCase()) || 
            expert.organization.toLowerCase().includes(candidate.education.toLowerCase())) {
            conflictFlag = true;
            conflictReason = "Potential Conflict: Same Institution/Organization";
            scorePenalty = 0.3; // Reduce score safely
        }
    }

    relevancyScore = Math.max(relevancyScore - scorePenalty, 0);

    // Generate Explanation
    let reasons = [];
    if (skillMatch > 0.5) reasons.push("Strong NLP-based skill/research overlap.");
    if (pubSimilarity > 0.3) reasons.push("Similar publication domains.");
    if (expMatch >= 0.8) reasons.push("Highly experienced expert in the field.");
    if (domainOverlap > 0.4) reasons.push("Strong research domain alignment.");
    
    if (reasons.length === 0) reasons.push("Minimal domain overlap found.");
    if (conflictFlag) reasons.push(`WARNING: ${conflictReason}`);

    return {
        expertId: expert._id,
        expertName: expert.name,
        organization: expert.organization,
        relevancyScore: parseFloat((relevancyScore * 100).toFixed(2)),
        conflictFlag,
        explanation: reasons,
        metrics: {
            skillMatch: (skillMatch * 100).toFixed(1) + '%',
            pubSimilarity: (pubSimilarity * 100).toFixed(1) + '%',
            expMatch: (expMatch * 100).toFixed(1) + '%',
            domainOverlap: (domainOverlap * 100).toFixed(1) + '%'
        }
    };
};

module.exports = {
    calculateCosineSimilarity,
    matchCandidateToExpert
};
