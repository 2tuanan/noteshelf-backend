const aiClient = require('../utils/aiClient');
const noteModel = require('../models/noteModel');

class AiController {
    summarize_note = async (req, res, next) => {
        const { id: userId } = req;
        const { noteId } = req.params;

        const note = await noteModel.findOne({ _id: noteId, userId });
        if (!note) return res.status(403).json({ message: 'Forbidden' });

        if (!process.env.OPENAI_API_KEY) {
            return res.status(502).json({ message: 'AI service unavailable' });
        }

        const contentText = note.content.replace(/<[^>]*>/g, ' ').trim();

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        let fullSummary = '';
        try {
            const stream = await aiClient.chat.completions.create({
                model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
                stream: true,
                messages: [
                    { role: 'system', content: 'Summarize the following note in 2-4 concise sentences.' },
                    { role: 'user', content: contentText }
                ],
            });

            for await (const chunk of stream) {
                const token = chunk.choices[0]?.delta?.content || '';
                if (token) {
                    fullSummary += token;
                    res.write(`data: ${JSON.stringify({ token })}\n\n`);
                }
            }

            note.summary = fullSummary;
            note.summaryUpdatedAt = new Date();
            await note.save();

            res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
            res.end();
        } catch (error) {
            res.status(502);
            res.write(`data: ${JSON.stringify({ error: 'AI service unavailable' })}\n\n`);
            res.end();
        }
    }
}

module.exports = new AiController();
