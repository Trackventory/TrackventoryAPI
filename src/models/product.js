const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: String,
    description: String,
    price: Number,
    stock: Number,
    image: String,
    category: {
        type: String,
        enum: ['computers', 'phones', 'accesories'],
        default: 'computers'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

const Products = mongoose.model('Products', productSchema);
module.exports = Products;