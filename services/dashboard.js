const {
  checkTableNotEmpty,
  getUser,
  getCoursesBySort,
  getWishListItems,
} = require('../models/dashboard');

const limit = 3;

const isMyCourseNotEmpty = async (userId) => {
  return await checkTableNotEmpty(userId, 'my_classes');
};

const isWishListNotEmpty = async (userId) => {
  return await checkTableNotEmpty(userId, 'wishlist');
};

const getDashBoardItems = async (userId) => {
  let user = await getUser(userId);
  let recentlyRegistered;
  let recentlyTaken;
  let wishlist;
  if (isMyCourseNotEmpty) {
    recentlyRegistered = {
      recentlyRegistered: await getCoursesBySort(userId, 'created_at', limit),
    };
    recentlyTaken = {
      recentlyTaken: await getCoursesBySort(userId, 'progress', limit),
    };
  }
  if (isWishListNotEmpty) {
    wishlist = { wishlist: await getWishListItems(userId, limit) };
  }
  const result = Object.assign(
    ...user,
    recentlyRegistered,
    recentlyTaken,
    wishlist
  );
  return result;
};

module.exports = { getDashBoardItems };
