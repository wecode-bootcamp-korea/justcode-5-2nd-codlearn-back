const { readItems, deleteItem, addItem } = require('../models/cart');

async function getCartItem(userId) {
  const items = await cart.readItems(userId);
  return items;
}

async function addToCart(cartlist, classId) {}
