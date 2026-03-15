const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const path = require("path");

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID;

// Text-to-speech
const synthesizeSpeech = async (text) => {
    const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
        {
            text
        },
        {
            responseType: "arraybuffer",
            headers: {
                "xi-api-key": ELEVENLABS_API_KEY,
                "Content-Type": "application/json",
            },
        }
    );

    const fileName = `voice_${Date.now()}.mp3`;
    const outputDir = path.join(__dirname, "..", "..", "generated-audio");

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const fullPath = path.join(outputDir, fileName);
    fs.writeFileSync(fullPath, response.data);

    return {
        fileName,
        filePath: fullPath,
        publicUrl: `/generated-audio/${fileName}`,
    };
};

// Speech-to-text
const transcribeAudio = async (filePath) => {
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));

    const response = await axios.post(
        "https://api.elevenlabs.io/v1/speech-to-text",
        form,
        {
            headers: {
                ...form.getHeaders(),
                "xi-api-key": ELEVENLABS_API_KEY,
            },
        }
    );

    return response.data.text || "";
};

module.exports = {
    synthesizeSpeech,
    transcribeAudio,
};