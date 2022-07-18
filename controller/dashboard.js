const { getDashBoardItems } = require('../services/dashboard');

const getDashBoardItemsController = async (req, res) => {
  const userId = req.params.id;
  const items = await getDashBoardItems(userId);
  return res.status(200).json({ data: items });
};

module.exports = { getDashBoardItemsController };
