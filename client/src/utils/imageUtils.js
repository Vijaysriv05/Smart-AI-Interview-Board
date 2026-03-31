export const getProfessionalImage = (name, role = 'Expert') => {
    const lowerName = (name || '').toLowerCase();
    
    // Explicit overrides for the user's primary experts
    if (lowerName.includes('anbu')) {
        return "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1200"; // High-end sweater portrait (Requested swap)
    }
    if (lowerName.includes('viji')) {
        return "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200"; // Executive, glasses, grey studio
    }
    if (lowerName.includes('diya')) {
        return "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1200"; // Female professional headshot
    }
    if (lowerName.includes('chitra')) {
        return "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=1200"; // Professional white background (Female)
    }

    // Detailed name heuristics for Indian and Global names
    const femaleCues = ['dr. sarah', 'emily', 'samantha', 'priya', 'anitha', 'sophia', 'linda', 'maria', 'elena', 'aisha', 'yuki', 'mei', 'leila', 'olivia', 'emma', 'isabella', 'mia', 'chitra', 'shanti', 'lakshmi', 'vidya', 'sneha', 'pooja', 'diya', 'amrita', 'neha', 'anjali', 'divya', 'kavita', 'meera', 'rani'];
    const isFemale = femaleCues.some(cue => lowerName.includes(cue));

    const maleCues = ['james', 'marcus', 'alex', 'john', 'robert', 'david', 'michael', 'william', 'joshua', 'vijay', 'krishnan', 'sanjay', 'arjun', 'rahul', 'chen', 'kenji', 'omar', 'liam', 'noah', 'oliver', 'anbu', 'raj', 'amit', 'vikram', 'aditya', 'rohan', 'karthik', 'naveen'];
    const isMale = maleCues.some(cue => lowerName.includes(cue));

    // Refined Ultra-Neat Professional Image Library
    const femaleImages = [
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200", // Executive, glasses, grey studio
        "https://images.unsplash.com/photo-1563990112129-a9a72c04f5d7?auto=format&fit=crop&q=80&w=1200", // High-end studio lit corporate
        "https://images.unsplash.com/photo-1580894732230-28501236239a?auto=format&fit=crop&q=80&w=1200", // Soft studio leadership
        "https://images.unsplash.com/photo-1573496359681-306d8636f3e1?auto=format&fit=crop&q=80&w=1200", // Elite studio profile
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1200", // Crisp professional headshot (Curly hair)
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1200", // Smiles, professional studio
        "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=1200", // High-key lit portrait
        "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=1200"  // Professional white background
    ];

    const maleImages = [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1200", // Sharp crisp studio portrait
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1200", // Leading executive look
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=1200", // Studio business formal
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=1200", // Clean modern executive
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=1200", // Crisp leadership studio
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1200", // High contrast studio
        "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=1200", // Clean tech leader look
        "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=1200"  // Corporate formal portrait
    ];

    const getHash = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    };

    const hash = getHash(name || 'default');

    if (isFemale) {
        return femaleImages[hash % femaleImages.length];
    } else if (isMale) {
        return maleImages[hash % maleImages.length];
    } else {
        const combined = [...femaleImages, ...maleImages];
        return combined[hash % combined.length];
    }
};

export const downloadImage = async (url, filename = 'professional-portrait.jpg') => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
        window.open(url, '_blank');
    }
};
