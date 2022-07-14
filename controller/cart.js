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
  const tempClassList = req.query.classId;
  let arr = [];
  let classList = [];
  if (Array.isArray(tempClassList)) {
    tempClassList.map((el) => {
      arr = [...arr, { class_id: Number(el) }];
    });
    classList = Array.from(new Set(arr));
  } else {
    classList = [{ class_id: Number(tempClassList) }];
  }
  await deleteFromCart(userId, classList);
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
