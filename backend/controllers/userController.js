import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log('[authUser] Login attempt for email:', email);

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    console.log('[authUser] Password matched, generating token for userId:', user._id);
    const token = generateToken(user._id);
    console.log('[authUser] Token generated, sending response with token');

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token, // Return JWT token for Bearer auth
    });
  } else {
    console.log('[authUser] Login failed - invalid email or password');
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  console.log('[registerUser] Registration attempt for email:', email);

  const userExists = await User.findOne({ email });

  if (userExists) {
    console.log('[registerUser] User already exists');
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    console.log('[registerUser] User created, generating token for userId:', user._id);
    const token = generateToken(user._id);
    console.log('[registerUser] Token generated, sending response with token');

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token, // Return JWT token for Bearer auth
    });
  } else {
    console.log('[registerUser] Failed to create user');
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  // Logout is handled on frontend by clearing localStorage token
  // No server-side action needed for stateless Bearer token auth
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
