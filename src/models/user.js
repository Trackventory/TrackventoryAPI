const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    email: { 
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Admin', 'Manager', 'Sales Person'],
        default: 'Sales Person'
    },
    active: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;