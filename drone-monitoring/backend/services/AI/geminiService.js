const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const generateHumanCheckPrompt = async () => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
            You are helping a rescue drone speak to a potentially unconscious or immobile human. 
            Write one short, calm, human-friendly sentence asking if they are okay.
            Rules:
            - Under 15 words
            - Simple language
            - Easy to understand
            - Only ask one question
            - No medical advice
            - No emojis
            - No acronyms
            - No hashtags
            - No extra commentary
            - No extra explanations
            - Do not ask for personal information
            - Do not ask for their name
            - Do not ask for their location
        `
    });

    return response.text.trim();
};

const analyzeHumanResponse = async (transcript) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
            A rescue drone asked a possibly immobile or unconscious person if they are okay.
            Transcript from the person: "${transcript}"

            Return ONLY valid JSON with the following format:
            {
                responded: boolean,
                needsHelp: boolean,
                confidence: "low" | "medium" | "high"
            }

            Rules:
            - responded is true only if this sounds like a meaningful human reply
            - needsHelp is true if the person asks for help, sounds distressed, or indicates danger
            - confidence must be one of: "low", "medium", "high"
            
            If the transcript is empty, responded should be false.
        `
    });

    return JSON.parse(response.text);
};

const generateIncidentSummary = async ( detection, transcript ) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
            Summarize this human safety event in 1 short sentence for a monitoring dashboard.

            Detection:
            ${JSON.stringify(detection, null, 2)}

            Transcript:
            ${transcript || "No response"}

            Keep it factual and concise.
        `
    });

    return response.text.trim();
}

module.exports = {
  generateHumanCheckPrompt,
  analyzeHumanResponse,
  generateIncidentSummary
};