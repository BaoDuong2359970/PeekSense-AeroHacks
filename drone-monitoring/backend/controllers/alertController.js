const axios = require('axios');

const generateVoiceAlert = async (message) => {
  try {
    const response = await axios.post('https://api.elevenlabs.io/text-to-speech', {
      apiKey: process.env.ELEVENLABS_API_KEY,
      text: message,
    });

    // The response contains the URL to the audio file
    return response.data.audioUrl;
  } catch (error) {
    console.error('Error generating voice alert:', error);
    throw error;  // Make sure to throw the error for the calling function to handle
  }
};

module.exports = { generateVoiceAlert };