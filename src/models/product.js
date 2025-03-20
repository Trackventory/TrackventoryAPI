const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        minlength: [3, 'Product name must be at least 3 characters'],
        maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
    },
    quantity: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: [0, 'Stock cannot be negative'],
    },
    image: {
        type: String,
        validate: {
            validator: (value) => validator.isURL(value),
            message: 'Invalid image URL',
        },
    },
    category: {
        type: String,
        enum: ['computers', 'phones', 'accessories'],
        default: 'computers',
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;