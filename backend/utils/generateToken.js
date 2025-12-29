import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  // Generate JWT token for Bearer token auth (header-based)
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  return token;
};

export default generateToken;
