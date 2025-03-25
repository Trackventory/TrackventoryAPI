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

// Only active Admin can get all users
userRouter.get('/', roleMiddleware(['Admin']), getAllUsers);

// Only active Admin can get all active users
userRouter.get('/active-users', roleMiddleware(['Admin']), getActiveUsers);

// Only active Admin can can view specific users
userRouter.get('/:id', getUserById);

// All active users can update their information
userRouter.patch('/update', updateUser);

// Only active Admin can update user role
userRouter.patch('/update-role', roleMiddleware(['Admin']), updateUserRole);

// Only active Admin can disable/enable specific users, disable = soft-delete
userRouter.patch('/disable/:id', roleMiddleware(['Admin']), disableUser);
userRouter.patch('/enable/:id', roleMiddleware(['Admin']), enableUser);

// Only active Admin can delete specific users
userRouter.delete('/delete/:id', roleMiddleware(['Admin']), deleteUser);

module.exports = userRouter;