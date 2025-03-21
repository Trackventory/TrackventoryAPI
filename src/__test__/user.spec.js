const {
  getUserById,
  updateUser,
  updateUserRole,
  disableUser,
  enableUser,
  deleteUser
} = require("../controllers/userController");
const User = require("../models/user");
const { isValidRole } = require("../utils/validator");

// Mock dependencies
jest.mock("../models/user");
jest.mock("../utils/validator");

describe("User controller", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {},
      params: {},
      query: {},
      userInfo: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });


  it("return 400 when the user ID parameter is missing from the request", async () => {
    req.params = {};
  
    await getUserById(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "User query parameter is required"
    });
  });


  it("return 404 when user does not exist for given ID", async () => {
    req.body = { id: "nonexistentUserId" };
  
    User.findById.mockResolvedValue(null);
  
    await updateUser(req, res);
  
    expect(User.findById).toHaveBeenCalledWith("nonexistentUserId");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "User does not exist!"
    });
  });


  it("returns 400 when the role is invalid according to isValidRole function", async () => {
    req.body = { id: "validUserId", role: "InvalidRole" };
    
    isValidRole.mockReturnValue(false);
  
    await updateUserRole(req, res);
  
    expect(isValidRole).toHaveBeenCalledWith("InvalidRole");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid role. Allowed roles are: 'Admin', 'Sales Person', 'Manager'"
    });
  });


  it("returns 400 when trying to disable a user that is already disabled", async () => {
    req.params = { id: "alreadyDisabledUserId" };
  
    User.findById.mockResolvedValue({ active: false });
  
    await disableUser(req, res);
  
    expect(User.findById).toHaveBeenCalledWith("alreadyDisabledUserId");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "User is already disabled!"
    });
  });
    

  
  it("returns 400 when trying to enable a user that is already enabled", async () => {
    req.params = { id: "alreadyEnabledUserId" };
  
    User.findById.mockResolvedValue({ active: true });
  
    await enableUser(req, res);
  
    expect(User.findById).toHaveBeenCalledWith("alreadyEnabledUserId");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "User is already enabled!"
    });
  });
    

  it("returns 404 when trying to delete a user that does not exist", async () => {
    req.params = { id: "nonexistentUserId" };
  
    User.findByIdAndDelete.mockResolvedValue(null);
  
    await deleteUser(req, res);
  
    expect(User.findByIdAndDelete).toHaveBeenCalledWith("nonexistentUserId");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "User does not exist!"
    });
  });
});