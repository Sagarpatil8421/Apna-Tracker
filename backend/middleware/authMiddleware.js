import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.slice(7); // Remove 'Bearer ' prefix
    console.log('[authMiddleware] Token found in Authorization header');
  }
  // Fallback to cookie for backward compatibility
  else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
    console.log('[authMiddleware] Token found in cookies (fallback)');
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('[authMiddleware] Token verified, userId:', decoded.userId);

      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        res.status(401);
        throw new Error('User not found');
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth middleware error:', error.message || error);
      // If headers already sent, delegate to next error handler
      if (res.headersSent) return next(error);
      res.status(401);
      // Preserve original error message when available
      throw new Error(error.message || 'Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

export { protect };
