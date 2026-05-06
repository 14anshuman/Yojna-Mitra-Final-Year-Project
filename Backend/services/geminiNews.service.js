import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const processNewsWithAI = async (rawTitle, rawContent) => {
    const prompt = `
    Analyze this Indian government news and return a JSON object.
    
    NEWS TITLE: ${rawTitle}
    NEWS CONTENT: ${rawContent}

    TASK:
    1. Categorize into one of: Agriculture, Education, Health, Finance, Housing, Women Welfare, or General.
    2. Identify state: If it's a state-specific scheme (e.g., mention of "Punjab Government"), name the state. Otherwise, use "Central".
    3. Translate the title and create a 3-bullet point summary in English (en), Hindi (hi), and Punjabi (pa).

    STRICT JSON FORMAT:
    {
      "category": "string",
      "state": "string",
      "content": 
        { "title": "string", "summary": ["point1", "point2", "point3"] },

    }`;

    try {
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        });

        return JSON.parse(result.response.text());
    } catch (error) {
        console.error("AI Processing Error:", error);
        return null;
    }
};