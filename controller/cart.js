const {} = require('../services/cart');

const readCartItems = async (req, res) => {
  const userId = req.params.id;
  const items = await cart.readCartItems(userId);
  console.log('userId: ', userId);
  console.log('items: ', items);
  return res.status(200).json(items);
};

module.exports = { readCartItems };
