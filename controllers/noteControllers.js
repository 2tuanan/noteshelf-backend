const { responseReturn } = require("../utils/response");
const noteModel = require("../models/noteModel");
const userModel = require("../models/userModel");
const delay = require("../utils/delay");

class noteControllers {
    add_note = async (req, res) => {
        await delay(200);
        const {id} = req;
        const {title, content} = req.body;        
        try {
            const newNote = await noteModel.create({
                userId: id,
                title,
                content
            })
            await userModel.findByIdAndUpdate(id, { $inc: {noteTotal: 1} });
            responseReturn(res, 201, {message: 'Note added!', note: newNote})
        } catch (error) {
            responseReturn(res, 500, {error: 'Internal Server Error!'})
        }
    }
    // End method
    get_notes = async (req, res) => {
        const {id} = req;
        try {
            const notes = await noteModel.find({userId: id});
            const totalNotes = notes.length;
            responseReturn(res, 200, {notes, totalNotes})
        } catch (error) {
            responseReturn(res, 500, {error: 'Internal Server Error!'})
        }
    }
    // End method
    delete_note = async (req, res) => {
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
            responseReturn(res, 500, {error: 'Internal Server Error!'})
        }

    }
    // End method
}

module.exports = new noteControllers();