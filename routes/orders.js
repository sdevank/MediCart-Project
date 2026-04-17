const router = require('express').Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// 1. Get ALL Orders (For Admin Panel)
router.get('/all', async (req, res) => {
    try {
        const orders = await Order.find().sort({ date: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
});

// 2. Create a New Order
router.post('/', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();

        // Deduct quantities from inventory stock
        for (let item of req.body.items) {
            await Product.findByIdAndUpdate(item.id, { 
                $inc: { stock: -item.quantity } 
            });
        }

        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

// 3. Get Orders for a specific User
router.get('/:email', async (req, res) => {
    try {
        const orders = await Order.find({ userEmail: req.params.email }).sort({ date: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
});

// 4. Update Order Status (Pending -> Shipped -> Delivered)
router.put('/:id/status', async (req, res) => {
    try {
        const newStatus = req.body.status;
        await Order.findByIdAndUpdate(req.params.id, { status: newStatus });
        res.json({ success: true, message: "Status updated to " + newStatus });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

module.exports = router;