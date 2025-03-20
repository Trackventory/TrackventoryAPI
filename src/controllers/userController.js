const User = require("../models/user");
const { isValidRole } = require("../utils/validator");

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    const allUsers = await User.find({},"firstName lastName phone email role active")
    .skip(skip)
    .limit(limit);

    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
        status: true,
        message: "Operation successful",
        currentPage: page,
        totalPages: totalPages,
        totalUsers: totalUsers,
        data: allUsers
    });
  } catch (error) {
    res.status(500).json({
        status: false,
        error: "An error occurred while getting users"
    });
  }
};

const getActiveUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    const activeUsers = await User.find(
        { active: true }, "firstName lastName phone email role active"
    ).skip(skip)
     .limit(limit);

    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
        status: true,
        message: "Operation successful",
        currentPage: page,
        totalPages: totalPages,
        totalUsers: totalUsers,
        data: activeUsers
    });
  } catch (error) {
    res.status(500).json({
        status: false,
        error: "An error occurred while getting users"
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const {id} = req.params;
    if (!id) {
      return res.status(400).json({
          status: false,
          message: "User query parameter is required"
      });
    }

    const user = await User.findById(id).select("firstName lastName phone email role active");
    if (!user) {
      return res.status(404).json({
          status: false,
          message: "User does not exist!"
      });
    }

    res.status(200).json({
        status: true,
        message: "Operation successful", data: user
    })
  } catch (error) {
    res.status(500).json({
        status: false,
        error: "An error occurred while fetching the user"
    });
  }
}

const updateUser = async (req, res) => {
  try {
    const { id, firstName, lastName, phone } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User does not exist!"
      });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    const updatedUser = await user.save();
    res.status(200).json({
      status: true,
      message: "Operation successful",
      data: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        userName: updatedUser.userName,
        phone: updatedUser.phone,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      }
    })
  } catch (error) {
    res.status(500).json({
        status: false,
        error: "An error occurred while updating the user"
    });
  }
}

const updateUserRole = async (req, res) => {
  try {
    const { id, role } = req.body;

    if (!id || !role) {
        return res.status(400).json({
            status: false,
            message: "UserId and role are required"
        });
    }

    if (role && !isValidRole(role)) {
        return res.status(400).json({
            success: false,
            message: "Invalid role. Allowed roles are: 'Admin', 'Sales Person', 'Manager'"
        });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User does not exist!"
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
        id,
        { role },
        { new: true, select: "_id firstName lastName phone email role createdAt updatedAt" }
    );

    res.status(200).json({
      status: true,
      message: "Operation successful",
      data: updatedUser
    })
  } catch (error) {
    res.status(500).json({
        status: false,
        error: "An error occurred while updating the user"
    });
  }
}

const disableUser = async (req, res) => {
  try {
    const {id} = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User does not exist!"
      })
    };

    if (!user.active) {
      return res.status(400).json({
        status: false,
        message: "User is already disabled!"
      })
    };

    user.active = false;
    await user.save();

    res.status(200).json({
        status: true,
        message: "User disabled successfully",
        data: { active: user.active } 
    });
  } catch (error) {
    res.status(500).json({
        status: false,
        error: "An error occurred while disabling the user"
    });
  }
}

const enableUser = async (req, res) => {
    try {
      const {id} = req.params;

      const user = await User.findById(id);
        if (!user) {
        return res.status(404).json({
            status: false,
            message: "User does not exist!"
        })
      };

      if (user.active) {
        return res.status(400).json({
            status: false,
            message: "User is already enabled!"
        })
      };

      user.active = true;
      await user.save();
  
      res.status(200).json({
        status: true,
        message: "User enabled successfully",
        data: { active: user.active }
      });
    } catch (error) {
        res.status(500).json({
            status: false,
            error: "An error occurred while enabling the user"
      });
    }  
}

const deleteUser = async(req, res) => {
  try {
    const {id} = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User does not exist!"
      });
    }
    
    res.status(200).json({
        status: true,
        message: "User permanently deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
        status: false,
        error: "An error occurred while deleting the user"
    });
  }
}

module.exports = {
    getAllUsers,
    getActiveUsers,
    getUserById,
    updateUser,
    updateUserRole,
    disableUser,
    enableUser,
    deleteUser
}