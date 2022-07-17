const {
  getWishList,
  addToWishList,
  deleteFromWishlist,
} = require('../services/wishlist');

const getwishListItemsController = async (req, res) => {
  const userId = req.params.id;
  const items = await getWishList(userId);
  return res.status(200).json({ data: items });
};

const addWishListItemController = async (req, res) => {
  const userId = req.params.id;
  const classId = req.query.classId;
  await addToWishList(userId, classId);
  return res.status(201).json({ message: 'item added into wishlist' });
};

const deleteWishListItemController = async (req, res) => {
  const userId = req.params.id;
  const classId = req.query.classId;
  await deleteFromWishlist(userId, classId);
  return res.status(201).json({ message: 'item added into wishlist' });
};

module.exports = {
  getwishListItemsController,
  addWishListItemController,
  deleteWishListItemController,
};
