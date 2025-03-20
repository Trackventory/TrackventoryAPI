const express = require('express');
const {
    getAllUsers,
    getActiveUsers,
    getUserById,
    updateUser,
    disableUser,
    enableUser,
    deleteUser
} = require('../controllers/userController');
const { authMiddleware, roleMiddleware} = require('../middleware/authMiddleware');

const userRouter = express.Router();

// Only Admin can get all users
userRouter.get('/', authMiddleware, roleMiddleware(['Admin']), getAllUsers);

// Only Admin can get all active users
userRouter.get('/active-users', authMiddleware, roleMiddleware(['Admin']), getActiveUsers);

// Only Admin can can view specific users
userRouter.get('/:id', authMiddleware, getUserById);

// Every user can update their information
userRouter.patch('/update-user', authMiddleware, updateUser);

// Only Admin can disable/enable specific users, disable = soft-delete
userRouter.patch('/disable-user/:id', authMiddleware, roleMiddleware(['Admin']), disableUser);
userRouter.patch('/enable-user/:id', authMiddleware, roleMiddleware(['Admin']), enableUser);

// Only Admin can delete specific users
userRouter.delete('/delete-user/:id', authMiddleware, roleMiddleware(['Admin']), deleteUser);

module.exports = userRouter;