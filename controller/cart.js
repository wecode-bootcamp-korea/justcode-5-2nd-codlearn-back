const { getCartItems, addToCart, deleteFromCart } = require('../services/cart');

const getCartItemsController = async (req, res) => {
  const userId = req.params.id;
  const items = await getCartItems(userId);
  return res.status(200).json({ data: items });
};

const addCartItemController = async (req, res) => {
  const userId = req.params.id;
  const classId = req.query.classId;
  await addToCart(userId, classId);
  return res.status(201).json({ message: 'item added into cart' });
};

const deleteCartItemController = async (req, res) => {
  const userId = req.params.id;
  const classId = req.query.classId;
  await deleteFromCart(userId, classId);
  return res.status(201).json({ message: 'item deleted from cart' });
};

module.exports = {
  getCartItemsController,
  addCartItemController,
  deleteCartItemController,
};
