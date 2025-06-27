const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // Bearer <token>
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      httpcode: 401,
      status: false,
      message: 'Access denied. Token not provided.'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        httpcode: 403,
        status: false,
        message: 'Invalid or expired token.'
      });
    }

    req.user = user; // Attach decoded token
    next(); // Go to route handler
  });
};

module.exports = authenticateToken;