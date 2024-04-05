const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || '8c26e5e13bc5b663fb311f38ddae41c79af62f75b520d3189806f0631169c9f5';

const authenticateToken = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) return res.sendStatus(401); // if there isn't any token

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403); // if the token has expired or is invalid
    req.user = user;
    next(); // proceed to the next middleware function
  });
};

module.exports = { authenticateToken};