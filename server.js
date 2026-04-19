if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const orderRoute = require('./routes/orders');
const reminderRoute = require('./routes/reminders');
const productRoute = require('./routes/products');
const authRoute = require('./routes/auth');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const User = require('./models/User');
const prescriptionRoute = require('./routes/prescription');
const bcrypt = require('bcryptjs');
const chatbotRoute = require('./routes/chatbot');
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
app.use('/api/chatbot', chatbotRoute);

// Default route redirects to login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// 2. Login Route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // 1. Find user
        const user = await User.findOne({ email });
        // STOP UNVERIFIED USERS
        if (user && !user.isVerified) {
            return res.status(401).json({ error: "Account not verified. Please sign up again to receive a new OTP." });
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

const nodemailer = require('nodemailer');
const Reminder = require('./models/Reminder');

const reminderTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
       user: process.env.EMAIL_USER,
       pass: process.env.EMAIL_PASS    // <-- Paste your new 16-digit code here!
    }
});

// This loop runs exactly once every 60,000 milliseconds (1 minute)
// setInterval(async () => {
//     try {
//         // 1. Get the current computer time in "HH:MM" 24-hour format
//         const now = new Date();
//         const currentHour = now.getHours().toString().padStart(2, '0');
//         const currentMinute = now.getMinutes().toString().padStart(2, '0');
//         const currentTime = `${currentHour}:${currentMinute}`;

//         // 2. Search the database for any active reminders matching THIS exact minute
//         const dueReminders = await Reminder.find({ time: currentTime, active: true });

//         // 3. Send an email for every reminder found
//         for (let reminder of dueReminders) {
//             const mailOptions = {
//                 from: 'MediCart Reminders <syitdevank73@gmail.com>',
//                 to: reminder.userEmail,
//                 subject: `⏰ MediCart: Time to take your ${reminder.medicineName}!`,
//                 html: `
//                     <div style="font-family: Arial, sans-serif; text-align: center; padding: 30px; border: 2px dashed #3498db; border-radius: 15px; max-width: 500px; margin: 0 auto; background-color: #f4f7f6;">
//                         <i style="font-size: 40px; color: #f39c12;">💊</i>
//                         <h2 style="color: #2c3e50;">Medicine Reminder!</h2>
//                         <p style="font-size: 1.1rem; color: #34495e;">Hello,</p>
//                         <p style="font-size: 1.1rem; color: #34495e;">It is time to take your scheduled medicine:</p>
                        
//                         <div style="background: white; padding: 15px; border-radius: 10px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
//                             <h1 style="color: #e74c3c; margin: 0;">${reminder.medicineName}</h1>
//                             <h3 style="color: #27ae60; margin: 10px 0 0 0;">Dosage: ${reminder.dosage}</h3>
//                         </div>
                        
//                         <p style="color: #7f8c8d; font-size: 0.9rem;">Please mark it as taken in your MediCart dashboard.</p>
//                         <p style="color: #7f8c8d; font-size: 0.9rem; font-weight: bold;">Stay healthy,<br>The MediCart Team</p>
//                     </div>
//                 `
//             };
            
//             // Send it!
//             reminderTransporter.sendMail(mailOptions, (error, info) => {
//                 if (error) {
//                     console.error("Failed to send reminder email:", error);
//                 } else {
//                     console.log(`✅ Automated Reminder sent to ${reminder.userEmail} for ${reminder.medicineName} at ${currentTime}`);
//                 }
//             });
//         }
//     } catch (err) {
//         console.error("Reminder System Error:", err);
//     }
// }, 60000); // 60000ms = 1 Minute
//app.use('/api/auth', authRoute);
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
module.exports = app;