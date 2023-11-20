const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    content: {
        required: true,
        type: String
    },
    state: {
        required: true,
        type: String
    },

    userid: {
        required: true,
        type: String
    },
    created_time: Date
})

module.exports = mongoose.model('Todo', todoSchema)
