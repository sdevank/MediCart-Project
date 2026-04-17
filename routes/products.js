const router = require('express').Router();
const Product = require('../models/Product');

// 1. SEED DATABASE
router.get('/seed', async (req, res) => {
    try {
        const seedProducts = [
            // Pain Relief
            { name: "Paracetamol 500mg (15 Tablets)", price: 30, category: "Pain Relief", image: "https://images.unsplash.com/photo-1584308666744-24d5e478542a?w=500", requiresRx: false, stock: 250 },
            { name: "Ibuprofen Advanced 400mg", price: 65, category: "Pain Relief", image: "https://images.unsplash.com/photo-1550572017-edb98939638c?w=500", requiresRx: false, stock: 120 },
            { name: "Diclofenac Pain Relief Gel 30g", price: 110, category: "Pain Relief", image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500", requiresRx: false, stock: 85 },
            
            // Supplements
            { name: "Vitamin C + Zinc Immunity (30s)", price: 150, category: "Supplements", image: "https://images.unsplash.com/photo-1577401239170-897942555fb3?w=500", requiresRx: false, stock: 300 },
            { name: "Omega 3 Fish Oil Capsules", price: 450, category: "Supplements", image: "https://images.unsplash.com/photo-1610484737751-605fb799a4a7?w=500", requiresRx: false, stock: 60 },
            { name: "Calcium + Vitamin D3 Tablets", price: 210, category: "Supplements", image: "https://images.unsplash.com/photo-1550572017-fdb98939638c?w=500", requiresRx: false, stock: 150 },
            { name: "Daily Multivitamin Gummies", price: 350, category: "Supplements", image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=500", requiresRx: false, stock: 90 },

            // Syrup
            { name: "Dry Cough Relief Syrup 100ml", price: 120, category: "Syrup", image: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=500", requiresRx: false, stock: 40 },
            { name: "Ayurvedic Tulsi Cough Drops", price: 180, category: "Syrup", image: "https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?w=500", requiresRx: false, stock: 55 },
            { name: "Antacid Liquid (Mint Flavor)", price: 105, category: "Syrup", image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500", requiresRx: false, stock: 110 },

            // Diabetes
            { name: "Insulin Glargine Pen (Pre-filled)", price: 850, category: "Diabetes", image: "https://images.unsplash.com/photo-1583947581924-860bda6a45df?w=500", requiresRx: true, stock: 25 },
            { name: "Glucometer Test Strips (50 Pack)", price: 900, category: "Diabetes", image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=500", requiresRx: false, stock: 200 },
            { name: "Metformin 500mg SR (15s)", price: 60, category: "Diabetes", image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500", requiresRx: true, stock: 180 },

            // Safety
            { name: "N95 Surgical Masks (Pack of 5)", price: 250, category: "Safety", image: "https://images.unsplash.com/photo-1586942551460-15afb89b70f0?w=500", requiresRx: false, stock: 500 },
            { name: "Premium First Aid Kit", price: 650, category: "Safety", image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500", requiresRx: false, stock: 30 },
            { name: "Digital Clinical Thermometer", price: 199, category: "Safety", image: "https://images.unsplash.com/photo-1606206873764-fd15e242df52?w=500", requiresRx: false, stock: 75 },
            { name: "Liquid Hand Sanitizer 500ml", price: 150, category: "Safety", image: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=500", requiresRx: false, stock: 400 },

            // General
            { name: "Antiseptic Liquid 250ml", price: 110, category: "General", image: "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=500", requiresRx: false, stock: 140 },
            { name: "Waterproof Band-Aids (100s)", price: 130, category: "General", image: "https://images.unsplash.com/photo-1631553127885-64bc63b7e73b?w=500", requiresRx: false, stock: 300 },
            { name: "ORS Rehydration Powder (Apple)", price: 45, category: "General", image: "https://images.unsplash.com/photo-1620021614275-8120c1d1a8e1?w=500", requiresRx: false, stock: 220 }
        ];

        //inserts all 20 products into MongoDB instantly
        await Product.insertMany(seedProducts);
        res.send(`
            <div style="font-family: Arial; text-align: center; margin-top: 50px;">
                <h1 style="color: #27ae60;">✅ Massive Success!</h1>
                <h2>20 New Medicines have been added to your database!</h2>
                <a href="/home.html" style="display: inline-block; margin-top: 20px; padding: 15px 30px; background: #3498db; color: white; text-decoration: none; border-radius: 25px; font-weight: bold;">Go back to Shop</a>
            </div>
        `);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error seeding database.");
    }
});
router.get('/seed', async (req, res) => {
    try {
        const seedProducts = [
            { name: "Paracetamol 500mg (10 Strip)", price: 40, category: "Pain Relief", image: "https://images.unsplash.com/photo-1584308666744-24d5e478542a?w=500", requiresRx: false, stock: 150 },
            { name: "Ibuprofen Advanced 400mg", price: 65, category: "Pain Relief", image: "https://images.unsplash.com/photo-1550572017-edb98939638c?w=500", requiresRx: false, stock: 100 },
            { name: "Vitamin C + Zinc Immunity", price: 150, category: "Supplements", image: "https://images.unsplash.com/photo-1577401239170-897942555fb3?w=500", requiresRx: false, stock: 200 },
            { name: "Omega 3 Fish Oil Capsules", price: 450, category: "Supplements", image: "https://images.unsplash.com/photo-1610484737751-605fb799a4a7?w=500", requiresRx: false, stock: 80 },
            { name: "Cough Syrup (Dry Cough)", price: 120, category: "Syrup", image: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=500", requiresRx: false, stock: 60 },
            { name: "Ayurvedic Tulsi Cough Drops", price: 180, category: "Syrup", image: "https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?w=500", requiresRx: false, stock: 45 },
            { name: "Insulin Glargine Pen", price: 850, category: "Diabetes", image: "https://images.unsplash.com/photo-1583947581924-860bda6a45df?w=500", requiresRx: true, stock: 30 },
            { name: "Glucometer Test Strips (50s)", price: 900, category: "Diabetes", image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=500", requiresRx: false, stock: 120 },
            { name: "N95 Surgical Masks (Pack of 5)", price: 250, category: "Safety", image: "https://images.unsplash.com/photo-1586942551460-15afb89b70f0?w=500", requiresRx: false, stock: 500 },
            { name: "Premium First Aid Kit", price: 650, category: "Safety", image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500", requiresRx: false, stock: 25 }
        ];

        // Insert all 10 products into the database at once!
        await Product.insertMany(seedProducts);
        res.send("<h1>✅ Success! 10 Medicines added to your database!</h1><p><a href='/home.html'>Go back to Home</a></p>");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error seeding database.");
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

// 4. UPDATE PRODUCT (The Bulletproof Edit Route)
router.put('/:id', async (req, res) => {
    try {
        const productId = req.params.id.trim(); // Removes accidental spaces
        
        // Find by ID and update with the data from the form
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            req.body,
            { new: true, runValidators: true } 
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product ID not found in database." });
        }

        res.status(200).json(updatedProduct);
    } catch (err) {
        console.error("Database Update Error:", err);
        res.status(500).json({ message: err.message }); 
    }
});

// 5. DELETE PRODUCT
router.delete('/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json(err);
    }
});

// MUST BE THE VERY LAST LINE
module.exports = router;