const { getCartItems, addToCart, deleteFromCart } = require('../services/cart');

const getCartItemsController = async (req, res) => {
  //const userId = req.params.id;
  const user = req.user;
  const cart = await getCartItems(user.id);
  return res.status(200).json({ data: cart });
};

const addCartItemController = async (req, res) => {
  //const userId = req.params.id;
  const user = req.user;
  const searchParams = new URLSearchParams(req.query);
  const classId = req.query.classId;
  if (searchParams.get('classId').split(',').length > 1) {
    const error = new Error('INVALID_INPUT: ADD ONE BY ONE');
    error.statusCode = 400;
    throw error;
  } else {
    await addToCart(user.id, classId);
    return res.status(201).json({ message: 'item added into cart' });
  }
};

const deleteCartItemController = async (req, res) => {
  const user = req.user;
  const classList = req.body;
  await deleteFromCart(user.id, classList);
  return res.status(201).json({ message: 'item deleted from cart' });
};

module.exports = {
  getCartItemsController,
  addCartItemController,
  deleteCartItemController,
};
