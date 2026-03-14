// NOT IMPLEMENTED YET
const axios = require("axios");

const generateVoiceAlert = async (message) => {
  try {
    const response = await axios.post(
      "https://api.elevenlabs.io/v1/text-to-speech",
      {
        text: message,
      },
      {
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error generating voice alert:", error.message);
    throw error;
  }
};

module.exports = {
  generateVoiceAlert,
};