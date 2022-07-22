const { checkTableNotEmpty } = require('../models/common');
const {
  getUser,
  getCoursesBySort,
  getWishListItems,
} = require('../models/dashboard');
const { getItems: getCartItem } = require('../models/cart');

const limit = 5;

const isMyCourseNotEmpty = async userId => {
  return await checkTableNotEmpty(userId, 'my_classes');
};

const isWishListNotEmpty = async userId => {
  return await checkTableNotEmpty(userId, 'wishlist');
};

const isCartNotEmpty = async userId => {
  return await checkTableNotEmpty(userId, 'cart');
};

const getDashBoardItems = async userId => {
  let user = await getUser(userId);
  let recentlyRegistered;
  let recentlyTaken;
  let wishlist;
  let cart;
  if (isMyCourseNotEmpty(userId)) {
    recentlyRegistered = {
      recentlyRegistered: await getCoursesBySort(userId, 'created_at', limit),
    };
    recentlyTaken = {
      recentlyTaken: await getCoursesBySort(userId, 'progress', limit),
    };
  }
  if (isWishListNotEmpty(userId)) {
    wishlist = { wishlist: await getWishListItems(userId, limit) };
  }

  if (isCartNotEmpty(userId)) {
    cart = { cart: await getCartItem(userId, limit) };
  }
  console.log('cart for dash ', cart);
  const result = Object.assign(
    ...user,
    recentlyRegistered,
    recentlyTaken,
    wishlist,
    cart
  );
  return result;
};

module.exports = { getDashBoardItems };
