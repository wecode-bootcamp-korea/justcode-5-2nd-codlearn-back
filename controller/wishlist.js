const {
  getWishList,
  addToWishList,
  deleteFromWishlist,
} = require('../services/wishlist');

const getwishListItemsController = async (req, res) => {
  const user = req.user;
  const items = await getWishList(user.id);
  return res.status(200).json({ data: items });
};

const addWishListItemController = async (req, res) => {
  const user = req.user;
  const classId = req.query.classId;
  await addToWishList(user.id, classId);
  return res.status(201).json({ message: 'item added into wishlist' });
};

const deleteWishListItemController = async (req, res) => {
  const user = req.user;
  const classId = req.query.classId;
  await deleteFromWishlist(user.id, classId);
  return res.status(201).json({ message: 'item deleted from wishlist' });
};

module.exports = {
  getwishListItemsController,
  addWishListItemController,
  deleteWishListItemController,
};
