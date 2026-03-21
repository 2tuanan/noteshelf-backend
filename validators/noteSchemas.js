const { z } = require('zod');

const createNoteSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200),
    content: z.string().min(1, 'Content is required').max(50000),
});

const updateNoteSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    content: z.string().min(1).max(50000).optional(),
}).refine((data) => data.title || data.content, {
    message: 'At least one field must be provided',
});

const searchQuerySchema = z.object({
    q: z.string().min(1, 'Search query is required').max(200),
});

module.exports = { createNoteSchema, updateNoteSchema, searchQuerySchema };
