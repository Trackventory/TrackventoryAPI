const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv/config');
const { isValidPhone, isValidEmail, isValidPassword, isValidRole } = require('../utils/validator');


const signUserUp = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            phone,
            email,
            password,
            role
        } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please enter both first name, last name, email and password.'
            });
        };

        if (phone && !isValidPhone(phone)) {
          return res.status(400).json({
              success: false,
              message: 'Invalid phone number. Use format: +2348012345678 or 08012345678'
          });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format.'
            });
        }

        if (!isValidPassword(password)) {
            return res.status(400).json({
                success: false,
                message: 'Password must contain at least 8 characters, including uppercase, lowercase, and a number.'
            });
        }

        if (role && !isValidRole(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role. Allowed roles are: 'Admin', 'Sales Person', 'Manager'"
            });
        }


        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({
               success: false,
               message: 'User already exists.'
            });
        };

        let saltRounds = 10;
            let hash = await bcrypt.hash(password, saltRounds);
            const newUser = new User({
                firstName,
                lastName,
                phone,
                email,
                password: hash,
                role: role || 'Sales Person'
            });

            await newUser.save();

            const { password: _, ...userData } = newUser.toObject();

            return res.status(201).json({
                success: true,
                message: 'Account created successfully!',
                data: userData
            });
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

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }

        let isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
          return res.status(401).json({
              success: false,
              message: 'Incorrect password'
          });
        }

        let token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET_KEY,
          { expiresIn: '15m'}
        );

        const { password: _, ...userData } = user.toObject();

        return res.status(200).json({
            success: true,
            message: 'Sign in successful',
            data: userData,
            token
        });
        
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const userId = req.userInfo.id;

        // extract old and new password
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found.'
            });
        }

        // check if old password is correct
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Old password not correct. Please try again.'
            });
        }

        // validate new password
        if (!isValidPassword(newPassword)) {
          return res.status(400).json({
              success: false,
              message: 'New password must contain at least 8 characters, including uppercase, lowercase, and a number.'
          });
      }

        // hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // update user password
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Password changed successfully.'
        });
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
    signUserIn,
    changePassword
};