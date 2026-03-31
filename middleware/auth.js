const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.header('x-auth-token');

  // GUEST BYPASS: If no token is present, use a consistent guest userId
  // so data persists across page reloads without requiring login
  if (!token) {
    req.user = { id: '65f1a2b3c4d5e6f7a8b9c0d1' };
    return next();
  }

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
