const jwt = require('jsonwebtoken');
const { readUserById } = require('../models/user');

require('dotenv').config();

const verifyToken = async (req, res, next) => {
  try {
    //const token = req.headers.authorization.split(' ')[1]; // front => header
    //const token = req.headers.authorization;
    const token = req.body.headers.Authorization; // temp for front
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decodedToken.id;
    const user = await readUserById(userId);
    if (!user) {
      res.status(401).send('Unauthorized');
    } else {
      req.token = token;
      req.user = user;
      next();
    }
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
    next(error);
  }
};

module.exports = { verifyToken };

