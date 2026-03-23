const { responseReturn } = require("../utils/response");
const noteModel = require("../models/noteModel");
const userModel = require("../models/userModel");
const delay = require("../utils/delay");
const sanitizeHtml = require('sanitize-html');
const { generateTags } = require('../utils/aiClient');

const SANITIZE_OPTIONS = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['h1', 'h2', 'u', 's']),
    allowedAttributes: { 'a': ['href', 'target'] },
};

class noteControllers {
    add_note = async (req, res, next) => {
        await delay(200);
        const {id} = req;
        const {title, content} = req.body;        
        try {
            const sanitizedContent = sanitizeHtml(content, SANITIZE_OPTIONS);
            const newNote = await noteModel.create({
                userId: id,
                title,
                content: sanitizedContent,
                contentType: 'html'
            })
            await userModel.findByIdAndUpdate(id, { $inc: {noteTotal: 1} });
            try {
                const tags = await generateTags(newNote.content);
                newNote.tags = tags;
                await newNote.save();
            } catch (tagError) {
                console.error('[auto-tag] Failed:', tagError.message);
            }
            responseReturn(res, 201, {message: 'Note added!', note: newNote})
        } catch (error) {
            next(error);
        }
    }
    // End method
    get_notes = async (req, res, next) => {
        const {id} = req;
        try {
            const notes = await noteModel.find({userId: id});
            const totalNotes = notes.length;
            responseReturn(res, 200, {notes, totalNotes})
        } catch (error) {
            next(error);
        }
    }
    // End method
    search_notes = async (req, res, next) => {
        const { id } = req;
        const { q } = req.query;
        try {
            const notes = await noteModel.find({
                userId: id,
                $text: { $search: q }
            }, {
                score: { $meta: 'textScore' }
            }).sort({ score: { $meta: 'textScore' } });
            responseReturn(res, 200, { notes, totalNotes: notes.length });
        } catch (error) {
            next(error);
        }
    }
    // End method
    update_note = async (req, res, next) => {
        try {
            const {id} = req.params;
            const note = await noteModel.findById(id);
            if (!note) {
                return responseReturn(res, 404, {error: 'Note not found!'})
            }
            if (note.userId.toString() !== req.id) {
                return responseReturn(res, 403, {error: 'Forbidden!'})
            }
            const {title, content} = req.body;
            if (title !== undefined) note.title = title;
            if (content !== undefined) {
                note.content = sanitizeHtml(content, SANITIZE_OPTIONS);
                note.contentType = 'html';
                note.summary = '';
                note.summaryUpdatedAt = null;
            }
            const updatedNote = await note.save();
            try {
                const tags = await generateTags(updatedNote.content);
                updatedNote.tags = tags;
                await updatedNote.save();
            } catch (tagError) {
                console.error('[auto-tag] Failed:', tagError.message);
            }
            responseReturn(res, 200, {message: 'Note updated!', note: updatedNote})
        } catch (error) {
            next(error);
        }
    }
    // End method
    delete_note = async (req, res, next) => {
        try {
            const {id} = req.params;
            const note = await noteModel.findById(id);
            if (!note) {
                return responseReturn(res, 404, {error: 'Note not found!'})
            }
            if (note.userId.toString() !== req.id) {
                return responseReturn(res, 403, {error: 'Forbidden!'})
            }
            await noteModel.findByIdAndDelete(id);
            await userModel.findByIdAndUpdate(req.id, { $inc: {noteTotal: -1} });
            responseReturn(res, 200, {message: 'Note deleted!'})
        } catch (error) {
            next(error);
        }

    }
    // End method
}

module.exports = new noteControllers();