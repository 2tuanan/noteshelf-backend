const {Schema, model} = require('mongoose');

const noteSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports = model('notes', noteSchema);