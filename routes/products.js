const router = require('express').Router();
const Product = require('../models/product');

// 1. GET ALL PRODUCTS
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: "Error fetching products" });
    }
});

// 2. SEED DATABASE (Run this once to add data)
router.post('/seed', async (req, res) => {
    const sampleProducts = [
        { name: "Paracetamol 500mg", price: 30, category: "Pain Relief", image: "https://via.placeholder.com/150?text=Paracetamol" },
        { name: "Vitamin C", price: 250, category: "Supplements", image: "https://via.placeholder.com/150?text=Vitamin+C" },
        { name: "Cough Syrup", price: 120, category: "Syrup", image: "https://via.placeholder.com/150?text=Syrup" },
        { name: "Diabetes Kit", price: 900, category: "Diabetes", image: "https://via.placeholder.com/150?text=Diabetes" },
        { name: "Pain Gel", price: 150, category: "Pain Relief", image: "https://via.placeholder.com/150?text=Pain+Gel" },
        { name: "N95 Masks", price: 200, category: "Safety", image: "https://via.placeholder.com/150?text=Masks" }
    ];

    try {
        await Product.deleteMany({}); // Clear old data
        await Product.insertMany(sampleProducts);
        res.status(201).json({ message: "Database seeded with products!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// 3. ADD NEW PRODUCT
router.post('/add', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// 4. DELETE PRODUCT
router.delete('/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json(err);
    }
});
module.exports = router;