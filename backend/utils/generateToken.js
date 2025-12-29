import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  // Cookie options for secure cross-domain authentication
  const cookieOptions = {
    httpOnly: true, // Prevent JavaScript access; blocks XSS attacks
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    // sameSite: 'None' required for cross-domain requests + secure cookies
    // sameSite: 'Lax' is safer for local development
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  };

  // DEBUG: Log cookie generation
  console.log('[generateToken] Setting JWT cookie with options:', {
    NODE_ENV: process.env.NODE_ENV,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    httpOnly: cookieOptions.httpOnly,
    maxAge: cookieOptions.maxAge,
    tokenLength: token.length,
  });

  res.cookie('jwt', token, cookieOptions);
};

export default generateToken;
