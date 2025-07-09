const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fpl_id: Number,
    userName: String,
    playerName: String,
    email: String,
    phoneNumber: String,
    password: String,
    role: {
        type: String,
        enum: [ "user", "admin" ],
        default: "user"
    },
}, {timestamps: true} );

module.exports = mongoose.model('Login Details', userSchema, 'Login Details');
