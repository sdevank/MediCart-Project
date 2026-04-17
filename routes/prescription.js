const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. AUTO-CREATE THE UPLOADS FOLDER IF IT IS MISSING!
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. CONFIGURE MULTER STORAGE
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// 3. HANDLE THE UPLOAD (Must match the 'prescription' label from frontend!)
router.post('/', upload.single('prescription'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file was uploaded." });
        }
        
        // Send a JSON success message back to the frontend
        res.status(200).json({ 
            message: "Prescription uploaded successfully!", 
            filePath: `/uploads/${req.file.filename}` 
        });

    } catch (err) {
        console.error("Upload Error:", err);
        res.status(500).json({ message: "Server error during upload." });
    }
});

module.exports = router;