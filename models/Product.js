const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true }, // Changed to Number for calculations
    category: { type: String, default: 'General' },
    image: { type: String, required: true }, // URL to image
    description: { type: String }
});

module.exports = mongoose.model('Product', productSchema);