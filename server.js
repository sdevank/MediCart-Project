const orderRoute = require('./routes/orders');
const reminderRoute = require('./routes/reminders');
const productRoute = require('./routes/products');
const authRoute = require('./routes/auth');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const User = require('./models/user');
const prescriptionRoute = require('./routes/prescription');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/medicartDB';

mongoose.connect(mongoURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Database connection error:", err));
    
// --- ROUTES ---
app.use('/api/auth', authRoute);
app.use('/api/products', productRoute);
app.use('/api/upload', prescriptionRoute);
app.use('/api/orders', orderRoute);
app.use('/api/reminders', reminderRoute);


// Default route redirects to login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// 2. Login Route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // 1. Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // 2. Compare the plain text password with the hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Send back user info
        res.status(200).json({ 
            message: "Login successful", 
            user: { firstName: user.firstName, lastName: user.lastName,email: user.email } 
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
//app.use('/api/auth', authRoute);
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));