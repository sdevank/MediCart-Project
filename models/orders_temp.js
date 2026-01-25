const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userEmail: { type: String, required: true }, // Link order to user
    items: [
        {
            name: String,
            quantity: Number,
            price: Number
        }
    ],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
        fullName: String,
        phone: String,
        address: String,
        city: String,
        zip: String
    },
    status: { type: String, default: "Pending" }, // Pending, Shipped, Delivered
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);