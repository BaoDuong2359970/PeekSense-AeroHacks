const axios = require('axios');

const analyzeIncident = async (incidentData) => {
  try {
    const response = await axios.post('https://api.gemini.com/analyze', {
      apiKey: process.env.GEMINI_API_KEY,
      incident: incidentData,
    });

    const summary = response.data.summary;
    return summary;
  } catch (error) {
    console.error('Error analyzing incident:', error);
    throw error;  // Make sure to throw the error for the calling function to handle
  }
};

module.exports = { analyzeIncident };