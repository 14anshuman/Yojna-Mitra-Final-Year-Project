import { GoogleGenerativeAI } from "@google/generative-ai";
import Scheme from "../models/scheme.model.js";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateAiRecommendations = async (userProfile) => {
    try {

        // console.log("djdh");
        
        // 1. HARD FILTERS (MongoDB): Get schemes user is actually eligible for
        const candidateSchemes = await Scheme.find({
            $or: [
                // Match User State OR Central Schemes
                // { state: { $in: [userProfile.state, 'Central', 'All'] } },
                // // Match Gender (Include 'All' as a fallback)
                // { gender: { $in: [userProfile.gender, 'Female', 'Others'] } },
                
                { category: { $in: userProfile.interests } }
            ]
        }).select('title description eligibility category tags benefits').lean();
     
        // console.log("Candidate Schemes after DB filters:", candidateSchemes.length);
        // Fallback if no schemes match basic criteria
        if (!candidateSchemes.length || !process.env.GEMINI_API_KEY) {
            return candidateSchemes.slice(0, 5);
        }

        // 2. PREPARE COMPACT DATA FOR AI (To save tokens/costs)
        const simplifiedSchemes = candidateSchemes.map(s => ({
            id: s._id,
            title: s.title,
            tags: s.tags,
            desc: s.description.substring(0, 150) // Shorten for the prompt
        }));

        // 3. STRUCTURED AI PROMPT
        const prompt = `
        You are a Government Scheme Recommender. 
        USER PROFILE:
        - Interests: ${userProfile.interests.join(', ')}
        - Category: ${userProfile.category}
        - Income Group: ${userProfile.incomeGroup}

        AVAILABLE SCHEMES:
        ${JSON.stringify(simplifiedSchemes)}

        TASK:
        Identify the top 5 schemes most relevant to the user's interests and profile.
        
        OUTPUT FORMAT:
        Return ONLY a valid JSON array of strings containing the IDs. 
        Example: ["id1", "id2"]`;

        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash", // Using Flash for speed and lower cost
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        // Clean the response (sometimes AI adds markdown blocks)
        const cleanedText = text.replace(/```json|```/g, "").trim();
        const recommendedIds = JSON.parse(cleanedText);

        // 4. HYDRATE RESULTS
        // Fetch full details of the IDs returned by AI
        const finalSchemes = await Scheme.find({ '_id': { $in: recommendedIds } });
        // console.log("AI Recommended IDs:", recommendedIds);
        // console.log("Final Schemes Fetched:", finalSchemes.map(s => s.title));

        // Maintain the order suggested by AI
        return recommendedIds.map(id => finalSchemes.find(s => s._id.toString() === id)).filter(Boolean);

    } catch (error) {
        console.error('AI Recommendation Error:', error);
        // Final fallback: Return any 5 matching schemes
        return await Scheme.find({ state: userProfile.state }).limit(5);
    }
};