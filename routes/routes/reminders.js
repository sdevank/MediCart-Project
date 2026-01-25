const router = require('express').Router();
const Reminder = require('../models/reminder_temp');

// 1. Add Reminder
router.post('/', async (req, res) => {
    try {
        const newReminder = new Reminder(req.body);
        const savedReminder = await newReminder.save();
        res.status(201).json(savedReminder);
    } catch (err) {
        res.status(500).json(err);
    }
});

// 2. Get User's Reminders
router.get('/:email', async (req, res) => {
    try {
        const reminders = await Reminder.find({ userEmail: req.params.email });
        res.status(200).json(reminders);
    } catch (err) {
        res.status(500).json(err);
    }
});

// 3. Delete Reminder
router.delete('/:id', async (req, res) => {
    try {
        await Reminder.findByIdAndDelete(req.params.id);
        res.status(200).json("Reminder deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;