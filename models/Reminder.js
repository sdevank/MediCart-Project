const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    medicineName: { type: String, required: true },
    dosage: { type: String, required: true }, // e.g., "1 Tablet"
    time: { type: String, required: true },   // e.g., "08:00 AM"
    active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Reminder', reminderSchema);