const Users = require("../models/user")

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await Users.find({},"firstName lastName phone email role active");
    res.status(200).json({
        status: true,
        message: "Operation successful",
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
    const activeUsers = await Users.find(
        { active: true },
        "firstName lastName phone email role active"
    );
    res.status(200).json({
        status: true,
        message: "Operation successful",
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

    const user = await Users.findById(id).select("firstName lastName phone email role active");
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
    const { id, firstName, lastName, phone, role} = req.body;

    const user = await Users.findById(id);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User does not exist!"
      });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (role) user.role = role;

    const updatedUser = await user.save();
    res.status(200).json({
      status: true,
      message: "Operation successful",
      data: {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        userName: updatedUser.userName,
        phone: updatedUser.phone,
        role: updatedUser.role,
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

const disableUser = async (req, res) => {
  try {
    const {id} = req.params;

    const user = await Users.findById(id);
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
        message: "User disabled successfully"
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

      const user = await Users.findById(id);
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
        message: "User enabled successfully"
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

    const user = await Users.findByIdAndDelete(id);
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
    disableUser,
    enableUser,
    deleteUser
}