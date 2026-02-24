const router = require('express').Router();
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// --- CONFIGURE EMAIL SENDER ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'medicart76@gmail.com',  // <-- PUT YOUR GMAIL HERE
        pass: 'saszezyzgfkjmueq'      // <-- PUT YOUR 16-DIGIT GMAIL APP PASSWORD HERE
    }
});

// 1. SIGNUP & SEND OTP
router.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user && user.isVerified) {
            return res.status(400).json({ message: "Email already registered & verified. Please login." });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (user && !user.isVerified) {
            // Update the existing unverified user with a new OTP
            user.firstName = firstName;
            user.lastName = lastName;
            user.phone = phone;
            user.password = hashedPassword;
            user.otp = otp;
            await user.save();
        } else {
            // Create brand new unverified user
            user = new User({ firstName, lastName, email, phone, password: hashedPassword, otp, isVerified: false });
            await user.save();
        }

        // Send the Email
        const mailOptions = {
            from: 'MediCart Admin',
            to: email,
            subject: 'MediCart - Your OTP Verification Code',
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2 style="color: #2c3e50;">Welcome to MediCart, ${firstName}!</h2>
                    <p>Your one-time password (OTP) to verify your account is:</p>
                    <h1 style="color: #3498db; letter-spacing: 5px; background: #f4f7f6; padding: 15px; border-radius: 8px; display: inline-block;">${otp}</h1>
                    <p style="color: #7f8c8d; font-size: 0.9rem;">This code is required to complete your registration.</p>
                </div>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Email Error:", error);
                return res.status(500).json({ message: "Failed to send OTP email." });
            }
            res.status(200).json({ message: "OTP sent to your email!" });
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// 2. VERIFY OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found." });
        if (user.isVerified) return res.status(400).json({ message: "User is already verified." });
        
        // Check if OTP matches
        if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP. Please try again." });

        // Mark account as verified and clear the OTP
        user.isVerified = true;
        user.otp = undefined; 
        await user.save();

        res.status(200).json({ message: "Account verified successfully!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
// 3. FORGOT PASSWORD (Send OTP)
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) return res.status(404).json({ message: "No account found with that email address." });

        // Generate new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        await user.save();

        // Send Email
        const mailOptions = {
            from: 'MediCart Admin',
            to: email,
            subject: 'MediCart - Password Reset Request',
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2 style="color: #2c3e50;">Password Reset</h2>
                    <p>We received a request to reset your password. Your OTP is:</p>
                    <h1 style="color: #e74c3c; letter-spacing: 5px; background: #f4f7f6; padding: 15px; border-radius: 8px; display: inline-block;">${otp}</h1>
                    <p style="color: #7f8c8d; font-size: 0.9rem;">If you did not request this, please ignore this email.</p>
                </div>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Email Error:", error);
                return res.status(500).json({ message: "Failed to send email." });
            }
            res.status(200).json({ message: "OTP sent to your email!" });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// 4. RESET PASSWORD (Verify OTP & Save New Password)
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) return res.status(404).json({ message: "User not found." });
        if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP. Please try again." });

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user
        user.password = hashedPassword;
        user.otp = undefined; // Clear OTP
        await user.save();

        res.status(200).json({ message: "Password reset successful!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
// 5. GET USER PROFILE
router.get('/user/:email', async (req, res) => {
    try {
        // Find the user by email, but exclude their password and OTP from the result for security!
        const user = await User.findOne({ email: req.params.email }).select('-password -otp');
        
        if (!user) return res.status(404).json({ message: "User not found" });
        
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
module.exports = router;