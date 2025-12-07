const jwt = require('jsonwebtoken');

// middleware function to verify JWT tokens
const authenticateToken = (req, res, next) => {
  // extract token from auth header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // attach user info to request object so route handlers can access it
    req.user = user;
    next(); // continue to the next middleware/route handler

  });
};

module.exports = authenticateToken;
