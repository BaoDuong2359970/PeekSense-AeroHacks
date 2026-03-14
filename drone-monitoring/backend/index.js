const express = require('express');
const { analyzeIncident } = require('./controllers/incidentController');
const { generateVoiceAlert } = require('./controllers/alertController');
const app = express();

// Example endpoint using the Gemini API
app.post('/api/analyze-incident', async (req, res) => {
  try {
    const summary = await analyzeIncident(req.body);
    res.json({ summary });
  } catch (error) {
    res.status(500).send('Error analyzing incident');
  }
});

// Example endpoint using the ElevenLabs API
app.post('/api/generate-alert', async (req, res) => {
  try {
    const audioUrl = await generateVoiceAlert(req.body.message);
    res.json({ audioUrl });
  } catch (error) {
    res.status(500).send('Error generating voice alert');
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});