const Products = require('../models/product');
const mongoose = require('mongoose');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Products.find();
        
        if (!products || products.length === 0) {
            return res.status(404).json({ 
                status: 'fail', 
                message: 'No products found' 
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Products retrieved successfully',
            data: products
        });
    } catch (error) {
        console.error('Error in getAllProducts:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Internal server error' 
        });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ 
                status: 'fail', 
                message: 'Invalid product ID' 
            });
        }

        const product = await Products.findById(id);
        
        if (!product) {
            return res.status(404).json({ 
                status: 'fail', 
                message: 'Product not found' 
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Product retrieved successfully',
            data: product
        });
    } catch (error) {
        console.error('Error in getProductById:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Internal server error' 
        });
    }
};


exports.deleteProductById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id) || !id) {
            return res.status(400).json({ 
                status: 'fail', 
                message: 'Invalid product ID' 
            });
        }
        const product = await Products.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!product) {
            return res.status(404).json({ 
                status: 'fail', 
                message: 'Product not found' 
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'Product deleted successfully',
            data: product
        });
    } catch (error) {
        console.error('Error in deleteProductById:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Internal server error' 
        });
        
    }
}

exports.addProduct = async (req, res) => {
    try {
        const { name, description, price, stock, image, category } = req.body;
        if (!name || !description || !price || !stock || !image || !category) {
            return res.status(400).json({ 
                status: 'fail', 
                message: 'All fields are required' 
            });
        }
        const existingProduct = await Products.findOne({ name });
        if (existingProduct) {
            return res.status(400).json({ 
                status: 'fail', 
                message: 'Product already exists' 
            });
        }
        const product = await Products.create({ name, description, price, stock, image, category });
        res.status(201).json({
            status: 'success',
            message: 'Product added successfully',
            data: product
        });
    } catch (error) {
        console.error('Error in addProduct:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Internal server error' 
        });
    }
}

exports.updateProduct 