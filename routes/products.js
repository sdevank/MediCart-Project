const router = require('express').Router();
const Product = require('../models/Product');

// 1. SEED DATABASE
router.get('/seed', async (req, res) => {
    const sampleProducts = [
        { name: "Paracetamol 500mg", price: 30, category: "Pain Relief", image: "https://via.placeholder.com/150?text=Paracetamol", requiresRx: false },
        { name: "Vitamin C", price: 250, category: "Supplements", image: "https://via.placeholder.com/150?text=Vitamin+C", requiresRx: false },
        { name: "Cough Syrup", price: 120, category: "Syrup", image: "https://via.placeholder.com/150?text=Syrup", requiresRx: true }, // Prescription Needed
        { name: "Diabetes Kit", price: 900, category: "Diabetes", image: "https://via.placeholder.com/150?text=Diabetes", requiresRx: true }, // Prescription Needed
        { name: "Pain Gel", price: 150, category: "Pain Relief", image: "https://via.placeholder.com/150?text=Pain+Gel", requiresRx: false },
        { name: "N95 Masks", price: 200, category: "Safety", image: "https://via.placeholder.com/150?text=Masks", requiresRx: false }
    ];

    try {
        await Product.deleteMany({}); // Safely clear old data
        await Product.insertMany(sampleProducts); // Insert new Rx data
        
        // Sends a big green success message to your browser
        res.send("<h1 style='color:green; text-align:center; font-family:sans-serif; margin-top:50px;'>✅ Database Seeded Successfully! <br><br> <a href='/home.html' style='color:blue; text-decoration:none;'>Click here to return to Home</a></h1>");
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});

// 2. GET ALL PRODUCTS
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: "Error fetching products" });
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