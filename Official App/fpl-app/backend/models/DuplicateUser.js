const mongoose = require('mongoose');

const duplicateUserSchema = new mongoose.Schema({
    fpl_id: Number,
    userName: String,
    playerName: String,
    teamName: String,
    email: String,
    phoneNumber: String,
    password: String,
    balance: Number,
    moneyEarned: Number,
    role: {
        type: String,
        enum: [ "user", "admin" ],
        default: "user"
    },
}, {timestamps: true} );


module.exports = mongoose.model('User Details', duplicateUserSchema, 'User Details');
