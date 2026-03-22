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
    },
    contentType: {
        type: String,
        enum: ['text', 'html'],
        default: 'text'
    }
}, {timestamps: true});

noteSchema.index({ title: 'text', content: 'text' });

module.exports = model('notes', noteSchema);