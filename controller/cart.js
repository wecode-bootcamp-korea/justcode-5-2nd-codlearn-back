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
  //const userId = req.params.id;
  const user = req.user;
  const tempClassList = req.query.classId;
  let arr = [];
  let classList = [];
  if (Array.isArray(tempClassList)) {
    tempClassList.map(el => {
      arr = [...arr, { class_id: Number(el) }];
    });
    classList = Array.from(new Set(arr));
  } else {
    classList = [{ class_id: Number(tempClassList) }];
  }
  await deleteFromCart(user.id, classList);
  // const promiseResult = classList.map(async (classId) => {
  //   await deleteFromCart(userId, classId); //전역에러 처리됨
  // });
  // await Promise.all(promiseResult); // wait for promiseResult to be done
  return res.status(201).json({ message: 'item deleted from cart' });
};

module.exports = {
  getCartItemsController,
  addCartItemController,
  deleteCartItemController,
};
