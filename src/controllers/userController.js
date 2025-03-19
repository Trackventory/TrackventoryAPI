const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv/config');

const signUserUp = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            role
        } = req.body;

        if (firstName && lastName) {
            const user = await User.findOne({ email });
            if (!user) {
                let saltRounds = 10;
                let hash = await bcrypt.hash(password, saltRounds);
                const newUser = new User({
                    firstName,
                    lastName,
                    email,
                    password: hash,
                    role
                });

                await newUser.save();

                return res.status(201).json({
                    success: true,
                    message: 'Account created successfully!',
                    data: newUser
                });
            }

            return res.status(409).json({
                success: false,
                message: 'User already exists.'
            });
        } else {
            return res.status(409).json({
                success: false,
                message: 'Please enter first name and last name.'
            });
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

const signUserIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user) {
            let isEqual = bcrypt.compare(password, user.password);
            if (isEqual) {
                let token = jwt.sign({
                    id: user._id,
                    role: user.role
                }, process.env.JWT_SECRET_KEY, {
                    expiresIn: '15m'
                });

                return res.status(200).json({
                    success: true,
                    message: 'Sign in successful',
                    data: user,
                    token
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Incorrect password'
                });
            }
        };
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

module.exports = {
    signUserUp,
    signUserIn
};