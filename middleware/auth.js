const jwt = require('jsonwebtoken');
require('dotenv').config();

// Check if user is authenticated
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });

    req.user = decoded; // { id, role }
    next();
  });
}

// Only allow leaders
function onlyLeader(req, res, next) {
  if (req.user.role !== 'leader') {
    return res.status(403).json({ message: 'Only leaders allowed' });
  }
  next();
}

module.exports = {
  verifyToken,
  onlyLeader
};
