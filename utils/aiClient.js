const OpenAI = require('openai');

const aiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const generateTags = async (content) => {
    const contentText = content.replace(/<[^>]*>/g, ' ').trim().slice(0, 1000);
    const response = await aiClient.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
            {
                role: 'system',
                content: 'Generate 3 to 5 short topic tags for the following note. ' +
                    'Return ONLY a JSON array of lowercase strings with no special characters. ' +
                    'Example: ["meeting", "project planning", "q4"]'
            },
            { role: 'user', content: contentText }
        ],
        response_format: { type: 'json_object' },
    });
    const parsed = JSON.parse(response.choices[0].message.content);
    return Array.isArray(parsed.tags) ? parsed.tags : Object.values(parsed)[0];
};

module.exports = { aiClient, generateTags };
