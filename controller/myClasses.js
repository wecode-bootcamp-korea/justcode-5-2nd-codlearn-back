const {
  getMyClassItems,
  addToMyClass,
  deleteFromMyClass,
} = require('../services/myClasses');

const getMyClassItemsController = async (req, res) => {
  const userId = req.params.id;
  const sort = req.query.sort;
  const items = await getMyClassItems(userId, sort);
  return res.status(200).json({ data: items });
};

const addMyClassItemsController = async (req, res) => {
  const userId = req.params.id;
  const classList = req.body;
  await addToMyClass(userId, classList);
  return res.status(201).json({ message: 'item added into my classes' });
};

const deleteMyClassItemController = async (req, res) => {
  const userId = req.params.id;
  const tempClassList = req.query.classId;
  let classList = [];
  if (Array.isArray(tempClassList)) {
    tempClassList.map((el) => {
      classList = [...classList, { class_id: Number(el) }];
    });
  } else {
    classList = [{ class_id: Number(tempClassList) }];
  }
  await deleteFromMyClass(userId, classList);
  return res.status(201).json({ message: 'item deleted from cart' });
};

module.exports = {
  getMyClassItemsController,
  addMyClassItemsController,
  deleteMyClassItemController,
};
