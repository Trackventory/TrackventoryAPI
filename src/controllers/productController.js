const Products = require('../models/product');
const mongoose = require('mongoose');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Products.find();
        
        if (!products || products.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'No products found!' 
            });
        }

        res.status(200).json({
            success: true,
            message: 'Products retrieved successfully!',
            data: products
        });
    } catch (error) {
        console.error('Error in getAllProducts:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
        });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid product ID' 
            });
        }

        const product = await Products.findById(id);
        
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product retrieved successfully',
            data: product
        });
    } catch (error) {
        console.error('Error in getProductById:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
        });
    }
};


exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id) || !id) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid product ID' 
            });
        }
        const product = await Products.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
            data: product
        });
    } catch (error) {
        console.error('Error in deleteProductById:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
        });
        
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id) || !id) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid product ID' 
            });
        }

        const { _id, isDeleted, createdAt, updatedAt, ...updateData } = req.body;
        const product = await Products.findByIdAndUpdate(id, updateData, { new: true });
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }
        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        console.error('Error in updateProduct:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
        });
        
    }
}