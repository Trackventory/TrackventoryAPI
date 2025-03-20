const express = require('express');
const {
    getAllUsers,
    getActiveUsers,
    getUserById,
    updateUser,
    updateUserRole,
    disableUser,
    enableUser,
    deleteUser
} = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');
const { activeUserMiddleware } = require('../middleware/activeUserMiddleware');

const userRouter = express.Router();

userRouter.use(authMiddleware);
userRouter.use(activeUserMiddleware);

// Only Admin can get all users
userRouter.get('/', roleMiddleware(['Admin']), getAllUsers);

// Only Admin can get all active users
userRouter.get('/active-users', roleMiddleware(['Admin']), getActiveUsers);

// Only Admin can can view specific users
userRouter.get('/:id', getUserById);

// Every user can update their information
userRouter.patch('/update', updateUser);

// Only Admin can update user role
userRouter.patch('/update-role', roleMiddleware(['Admin']), updateUserRole);

// Only Admin can disable/enable specific users, disable = soft-delete
userRouter.patch('/disable/:id', roleMiddleware(['Admin']), disableUser);
userRouter.patch('/enable/:id', roleMiddleware(['Admin']), enableUser);

// Only Admin can delete specific users
userRouter.delete('/delete/:id', roleMiddleware(['Admin']), deleteUser);

module.exports = userRouter;