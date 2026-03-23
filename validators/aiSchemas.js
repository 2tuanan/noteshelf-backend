const { z } = require('zod');

const chatMessageSchema = z.object({
    noteId: z.string().min(1),
    message: z.string().min(1).max(2000),
    history: z
        .array(
            z.object({
                role: z.enum(['user', 'assistant']),
                content: z.string()
            })
        )
        .max(20)
        .optional()
        .default([])
});

module.exports = { chatMessageSchema };
