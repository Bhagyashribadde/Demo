require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.post('/webhook', async (req, res) => {
  try {
    const userMessage = req.body.queryResult.queryText;
    
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userMessage }]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const botReply = response.data.choices[0].message.content;
    res.json({ fulfillmentText: botReply }); // Fixed casing (fulfillmentText)

  } catch (error) {
    console.error("OpenAI Error:", error.response?.data || error.message);
    res.json({ fulfillmentText: "Sorry, I couldn't get a response." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { // Fixed: app.listen (lowercase "L")
  console.log(`Server running on http://localhost:${PORT}/webhook`); // Fixed template string
});