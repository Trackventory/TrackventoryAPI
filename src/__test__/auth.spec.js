const { signUserUp, signUserIn, changePassword } = require("../controllers/authController");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { isValidPassword } = require("../utils/validator");

// Mock dependencies
jest.mock("../models/user");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../utils/validator");

describe("Auth controller", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {},
      userInfo: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  it('returns error message when email is missing from signUp payload', async () => {
    req.body = {
      firstName: 'John',
      lastName: 'Doe',
      password: 'Password123'
    };
  
    await signUserUp(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Please enter both first name, last name, email and password.'
    });
  });


  it('returns error message when the login password does not match the stored password', async () => {
    req.body = {
      email: 'test@example.com',
      password: 'wrongPassword'
    };
  
    const mockUser = {
      _id: 'userId123',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: 'Sales Person',
      toObject: jest.fn().mockReturnValue({
        _id: 'userId123',
        email: 'test@example.com',
        role: 'Sales Person'
      })
    };
  
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);
  
    await signUserIn(req, res);
  
    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(bcrypt.compare).toHaveBeenCalledWith('wrongPassword', 'hashedPassword');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Incorrect password'
    });
  });


  it("returns error message when the new password in change-password payload is invalid", async () => {
    req.userInfo.id = 'userId123';
    req.body = {
      oldPassword: 'OldPassword123',
      newPassword: 'short'
    };
  
    const mockUser = {
      _id: 'userId123',
      password: 'hashedOldPassword',
      save: jest.fn()
    };
  
    User.findById.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    isValidPassword.mockReturnValue(false);
  
    await changePassword(req, res);
  
    expect(User.findById).toHaveBeenCalledWith('userId123');
    expect(bcrypt.compare).toHaveBeenCalledWith('OldPassword123', 'hashedOldPassword');
    expect(isValidPassword).toHaveBeenCalledWith('short');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'New password must contain at least 8 characters, including uppercase, lowercase, and a number.'
    });
  });
});