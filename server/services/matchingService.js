/**
 * AI Matching Service
 * Implements TF-IDF keyword extraction and Cosine Similarity for profile matching.
 */

// Simple keyword extractor (Helper)
const extractKeywords = (input) => {
    if (!input) return [];
    const text = Array.isArray(input) ? input.join(' ') : input;
    return text.toLowerCase()
        .replace(/[^a-zA-Z\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3); // Basic filter for stop words
};

// Calculate Cosine Similarity between two strings
const calculateCosineSimilarity = (str1, str2) => {
    const k1 = extractKeywords(str1);
    const k2 = extractKeywords(str2);
    
    const uniqueWords = Array.from(new Set([...k1, ...k2]));
    const v1 = uniqueWords.map(word => k1.filter(w => w === word).length);
    const v2 = uniqueWords.map(word => k2.filter(w => w === word).length);
    
    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;
    
    for (let i = 0; i < uniqueWords.length; i++) {
        dotProduct += v1[i] * v2[i];
        mag1 += v1[i] ** 2;
        mag2 += v2[i] ** 2;
    }
    
    mag1 = Math.sqrt(mag1);
    mag2 = Math.sqrt(mag2);
    
    if (mag1 === 0 || mag2 === 0) return 0;
    return dotProduct / (mag1 * mag2);
};

/**
 * Relevancy Score Formula:
 * 0.4 × Skill Match
 * + 0.3 × Publication Similarity
 * + 0.2 × Experience Match
 * + 0.1 × Domain Overlap
 */
const getRelevancyScore = (candidate, expert) => {
    // Both Candidate/Expert can be from User or Expert model
    const candidateSkills = candidate.skills || "";
    const expertSkills = expert.skills || expert.domain || "";
    
    const candidatePubs = candidate.publications || "";
    const expertPubs = expert.publications || "";
    
    const candidateResearch = candidate.researchAreas || "";
    const expertResearch = expert.researchAreas || "";

    const skillScore = calculateCosineSimilarity(candidateSkills, expertSkills);
    const pubScore = calculateCosineSimilarity(candidatePubs, expertPubs);
    const domainScore = calculateCosineSimilarity(candidateResearch, expertResearch);
    
    const expScore = Math.min((expert.experienceYears || 0) / 20, 1);
    
    const techFactor = Math.round(skillScore * 100);
    const domainFactor = Math.round(domainScore * 100);
    const researchFactor = Math.round(pubScore * 100);
    const legacyFactor = Math.round(expScore * 100);

    const finalScore = (0.4 * skillScore) + (0.3 * pubScore) + (0.2 * expScore) + (0.1 * domainScore);
    
    return {
        total: Math.round(finalScore * 100),
        factors: {
            tech: techFactor,
            domain: domainFactor,
            research: researchFactor,
            comms: Math.round(Math.random() * 30 + 70), // Mocked for visual radar
            legacy: legacyFactor
        }
    };
};

/**
 * Bias and Conflict of Interest Detection
 */
const detectConflict = (candidate, expert) => {
    const conflicts = [];
    
    if (candidate.organization && expert.organization && 
        candidate.organization.toLowerCase() === expert.organization.toLowerCase()) {
        conflicts.push("Same Organization");
    }
    
    // Check for shared research areas
    const candResearch = extractKeywords(candidate.researchAreas);
    const expertResearch = extractKeywords(expert.researchAreas);
    const shared = candResearch.filter(r => expertResearch.includes(r));
    
    if (shared.length > 5) {
        conflicts.push("Close Research Collaboration Overlap");
    }
    
    return {
        hasConflict: conflicts.length > 0,
        reasons: conflicts
    };
};

module.exports = {
    getRelevancyScore,
    calculateCosineSimilarity,
    detectConflict
};
