const router = require('express').Router();
const multer = require('multer');
const path = require('path');

// 1. Configure where to save files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads'); // Save in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        // Name the file: timestamp + original extension (e.g., 1234567.jpg)
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// 2. The Upload Route
// 'image' matches the name attribute in the HTML form
router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }
        
        // Here you would typically save the file path to the database
        // For now, we just confirm success
        res.status(200).json({ 
            message: "Prescription uploaded successfully!", 
            filePath: `/uploads/${req.file.filename}` 
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;