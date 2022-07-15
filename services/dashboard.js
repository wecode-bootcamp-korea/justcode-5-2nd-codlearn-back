const { checkMyClassItems, getItems } = require('../models/dashboard');

const doesExist = async (userId) => {
  return await checkMyClassItems(userId);
};

const getDashBoardItems = async (userId) => {
  const items = await getItems(userId);
  return items;
};

module.exports = { getDashBoardItems };
