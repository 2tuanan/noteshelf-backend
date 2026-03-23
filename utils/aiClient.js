const OpenAI = require('openai');

const aiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

module.exports = aiClient;
