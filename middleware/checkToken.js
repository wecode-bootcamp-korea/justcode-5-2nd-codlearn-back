const jwt = require('jsonwebtoken');
const { readUserById } = require('../models/user');

require('dotenv').config();

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // front => header
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decodedToken.id;
    const user = await readUserById(userId);
    if (!user) {
      res.status(401).send('Unauthorized');
    } else {
      next();
    }
  } catch (e) {
    res.status(401).send('Unauthorized');
  }
};

module.exports = { verifyToken };
