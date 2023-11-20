const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    account: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },

    nick: {
        required: true,
        type: String
    },
    email: String
})

module.exports = mongoose.model('User', userSchema)
