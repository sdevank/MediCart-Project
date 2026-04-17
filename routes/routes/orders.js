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
// Get ALL orders from all users (For Admin Panel)
router.get('/all', async (req, res) => {
    try {
        // Fetch all orders and sort by newest first
        const orders = await Order.find().sort({ createdAt: -1 }); 
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch all orders' });
    }
});

//Update Order Status (Pending -> Shipped -> Delivered)
router.put('/:id/status', async (req, res) => {
    try {
        const newStatus = req.body.status;
        // Find the order by ID and update the status text
        await Order.findByIdAndUpdate(req.params.id, { status: newStatus });
        res.json({ success: true, message: "Status updated to " + newStatus });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update order status' });
    }
});
module.exports = router;