const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    otp: { type: String }, 
    isVerified: { type: Boolean, default: false }
}, { collection: 'users' });

module.exports = mongoose.model('User', userSchema);
