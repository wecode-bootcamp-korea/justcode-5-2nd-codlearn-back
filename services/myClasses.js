const {
  checkTableNotEmpty,
  readClassIds,
  readClassIdByClassId,
} = require('../models/common');

const {
  getItems,
  addItem,
  deleteItem,
  updateItem,
} = require('../models/myClasses');

const errMsg = {
  classNotFound: 'CLASS_NOT_FOUND',
  classExist: 'CLASS_EXIST',
};

const doesExist = async (userId, classList) => {
  const items = await readClassIds(userId);
  const res = classList.filter(el =>
    items.some(el2 => el2.class_id === el.class_id)
  );
  return res.map(obj => obj.class_id);
};

const doesNotExist = async (userId, classList) => {
  const items = await readClassIds(userId);
  const res = classList.filter(el => {
    return !items.some(el2 => el2.class_id === el.class_id);
  });
  return res.map(obj => obj.class_id);
};

const getMyClassIds = async userId => {
  const classIds = await readClassIds(userId);
  return classIds;
};

const getMyClassItems = async (userId, sort) => {
  const items = await getItems(userId, sort);
  return items;
};

const addToMyClass = async (userId, classList) => {
  const classExist = await doesExist(userId, classList);
  if (classExist.length === 0) {
    classList.forEach(async el => {
      await addItem(userId, el.class_id);
    });
  } else {
    console.log('class already in my classes');
    const msg = 'CLASS_EXIST: class_id: ' + JSON.stringify(classExist);
    const error = new Error(msg);
    error.statusCode = 400;
    throw error;
  }
};

const deleteFromMyClass = async (userId, classList) => {
  const classNotExist = await doesNotExist(userId, classList);
  if (classNotExist.length === 0) {
    classList.forEach(async classId => {
      await deleteItem(userId, classId);
    });
  } else {
    console.log('ADD_FAILED: class is not in my classes.');
    const msg = 'CLASS_NOT_FOUND: classId: ' + JSON.stringify(classNotExist);
    const error = new Error(msg);
    error.statusCode = 400;
    throw error;
  }
};

const updateProgressOfMyClass = async (userId, classId, progress) => {
  const classExist = await readClassIdByClassId(userId, classId, 'my_classes');
  if (classExist.length !== 0) {
    await updateItem(userId, classId, progress);
  } else {
    console.log('UPDATE_FAILED: class is not in my classes');
    const msg = `CLASS_NOT_EXIST: class_id: ${classId}`;
    const error = new Error(msg);
    error.statusCode = 400;
    throw error;
  }
};

module.exports = {
  getMyClassIds,
  getMyClassItems,
  addToMyClass,
  deleteFromMyClass,
  updateProgressOfMyClass,
};
