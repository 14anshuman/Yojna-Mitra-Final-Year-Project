import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const languageNames = {
  en: "English",
  hi: "Hindi (हिन्दी)",
  pa: "Punjabi (ਪੰਜਾਬੀ)",
  bn: "Bengali (বাংলা)",
  te: "Telugu (తెలుగు)",
  ta: "Tamil (தமிழ்)",
  gu: "Gujarati (ગુજરાતી)",
  mr: "Marathi (मराठी)",
  kn: "Kannada (ಕನ್ನಡ)",
  ml: "Malayalam (മലയാളം)",
  or: "Odia (ଓଡ଼ିଆ)",
  ur: "Urdu (اردو)",
  sa: "Sanskrit (संस्कृतम्)",
  ne: "Nepali (नेपाली)",
  sd: "Sindhi (سنڌي)",
  ks: "Kashmiri (کٲشُر)"
};

export const generateSchemeResponse = async (scheme, question, language = 'en') => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
        
        const prompt = `
### ROLE
You are "Yojna Mitra," an expert government scheme consultant. Your goal is to provide accurate, empathetic, and factual information based ONLY on the provided scheme data.

### SCHEME DATA:
- **Name**: ${scheme.title}
- **Entity**: ${scheme.ministry || 'Not specified'} (${scheme.level} level)
- **Region**: ${scheme.state || 'National'}
- **Description**: ${scheme.description}
- **Eligibility**: ${scheme.eligibility?.length ? scheme.eligibility.join('; ') : 'Data not available'}
- **Documents Required**: ${scheme.documentsRequired?.map(doc => typeof doc === 'string' ? doc : JSON.stringify(doc)).join(', ') || 'Contact department'}
- **Application Process**: ${scheme.howToApply?.length > 0 
    ? scheme.howToApply.map((step, index) => `${index + 1}. ${step}`).join('\n') 
    : 'Information not specified. Please refer to the official government portal.'}
- **Benefits**: ${scheme.keyFeatures?.map(f => typeof f === 'string' ? f : JSON.stringify(f)).join(', ') || 'Contact department'}

### USER QUESTION:
"${question}"

### INSTRUCTIONS:
1. **Language**: You MUST respond entirely in ${languageNames[language] || 'English'}.
2. **Match Check**: 
   - IF the user's language matches ${languageNames[language]}, provide the information about the scheme.
   - IF the user's language does NOT match ${languageNames[language]}, do NOT answer the question. Instead, inform the user in the **Selected Language** (${languageNames[language]}) that they must ask their question in that specific language to proceed.
2. **Constraint**: Use ONLY the data provided above. If the data is missing for a specific question (e.g., specific documents or dates), say: "I'm sorry, that specific detail is not available in our database. Please check the official portal."
3. **Deadlines**: If the user asks about dates, compare ${new Date()} with the Close Date and explicitly state if the scheme is "Currently Open" or "Expired."
4. **Safety**: If the question is unrelated to government schemes or this specific scheme, politely redirect the user to ask about ${scheme.title}.
5. **Formatting**: Use bullet points for steps and bold text for key requirements to make it readable.
6. **Tone**: Be empathetic, helpful, and concise. Avoid jargon and explain any technical terms in simple language.
7. **Fallback**: If the question is ambiguous or you cannot determine the user's intent, ask for clarification instead of guessing.
8. **No External Knowledge**: Do NOT use any information outside of the provided scheme data. If you don't know the answer based on the data, say so clearly.
9. **Follow-up**: Ask if the user has any more questions about ${scheme.title} or if they need help with the application process.
10. **Avoid Repetition**: If the user asks multiple questions, try to answer them in a single response without repeating information unnecessarily.
11. **Greeting**: At the start of the conversation, greet the user and introduce yourself as "Yojna Mitra," their personal assistant for government schemes.After it no need to repeat the greeting as hello.
12. **Closing**: End your response by asking if the user needs further assistance or has more questions about the scheme.
13. **Ask Questions**: If the user's question is vague, ask specific follow-up questions to better understand their needs before providing an answer.
14. **Language Nuance**: If the user is asking in Hindi or Punjabi in any other language, respond in that language to make it more personalized.

### RESPONSE:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error generating chatbot response:', error);
        return "I apologize, but I'm having trouble processing your question. Please try asking in a different way or contact support for assistance.";
    }
};
