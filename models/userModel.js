const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    image: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        default: 'user'
    },
    noteTotal: {
        type: Number,
        default: 0
    }
}, {timestamps: true});
module.exports = model('users', userSchema);