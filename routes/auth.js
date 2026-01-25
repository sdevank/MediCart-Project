const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

router.post('/signup', async (req, res) => {
    try {
        // 1. Receive firstName and lastName directly
        const { firstName, lastName, email, phone, password } = req.body;

        // 2. Check for existing user
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // 3. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create User (No splitting needed now)
        const newUser = new User({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);

    } catch (err) {
        console.error(err); // This prints the exact error to your VS Code terminal
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;