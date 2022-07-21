const { getDashBoardItems } = require('../services/dashboard');

const getDashBoardItemsController = async (req, res) => {
  const user = req.user;
  const items = await getDashBoardItems(user.id);
  return res.status(200).json({ data: items });
};

module.exports = { getDashBoardItemsController };
