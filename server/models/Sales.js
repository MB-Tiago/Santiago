const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Sales = mongoose.model('Sales', salesSchema);

module.exports = Sales;
