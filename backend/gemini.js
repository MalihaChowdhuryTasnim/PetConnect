require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function askGemini(question) {

    const prompt = `
You are Paws, the AI assistant for PetConnect.

PetConnect is a pet adoption website.

Help users with:
- pet care
- feeding
- basic pet behavior
- vaccination information
- adoption questions
- general dog, cat, rabbit and other pet-related questions

Give simple, friendly and useful answers.

If the user describes a serious medical problem,
do not pretend to diagnose the animal.
Recommend contacting a veterinarian.

User question:
${question}
`;

    const response = await ai.models.generateContent({
       model: "gemini-3.6-flash",
        contents: prompt
    });

    return response.text;
}

module.exports = askGemini;