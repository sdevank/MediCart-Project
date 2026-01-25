const router = require('express').Router();
const Order = require('../models/order_temp');
// 0. Get ALL Orders (Admin only)
router.get('/all', async (req, res) => {
    try {
        // .sort({ date: -1 }) shows newest orders first
        const orders = await Order.find().sort({ date: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
});
// 1. Create a New Order
router.post('/', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

// 2. Get Orders for a User
router.get('/:email', async (req, res) => {
    try {
        const orders = await Order.find({ userEmail: req.params.email });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;