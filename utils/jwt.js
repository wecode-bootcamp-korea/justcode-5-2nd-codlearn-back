const jwt = require('jsonwebtoken');

module.exports = {
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      return null;
    }
  },
};
