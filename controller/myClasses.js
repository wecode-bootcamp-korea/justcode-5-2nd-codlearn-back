const {
  getMyClassItems,
  addToMyClass,
  deleteFromMyClass,
  updateProgressOfMyClass,
} = require('../services/myClasses');

const isClassListInputValid = classList => {
  if (classId == null || classId === '') {
    console.log(`INVALID_INPUT: classId=undefined or null`);
    return false;
  }
  if (classId === '') {
    console.log(`INVALID_INPUT: classId=${classId}`);
    return false;
  }
  return true;
};

const isInputValid = (input, str) => {
  if (input == null || input === '') {
    console.log(`INVALID_INPUT: ${str} = undefined or null`);
    return false;
  }
  if (str === 'sort') {
    if (input !== 'class_name' || input !== 'created_at') {
      console.log(`INVALID_INPUT: ${input} is not valid sort option.`);
      return false;
    }
  }
  if (input.includes(',') || typeof input !== 'string') {
    console.log(`INVALID_INPUT: ${str} = ${input}`);
    return false;
  }
  return true;
};

const getMyClassItemsController = async (req, res) => {
  const userId = req.params.id;
  const sort = req.query.sort;
  if (
    isInputValid(userId, 'userId') &&
    isInputValid(classId, 'classId') &&
    isInputValid(sort, 'sort')
  ) {
    const items = await getMyClassItems(userId, sort);
    return res.status(200).json({ data: items });
  } else {
    const msg =
      'INVALID_INPUT: userId, classId, progress MUST HAVE A SINGLE VALUE';
    const error = new Error(msg);
    error.statusCode = 400;
    throw error;
  }
};

const addMyClassItemsController = async (req, res) => {
  const userId = req.params.id;
  const classList = req.body;
  await addToMyClass(userId, classList);
  return res.status(201).json({ message: 'class added into my classes' });
};

const deleteMyClassItemController = async (req, res) => {
  const userId = req.params.id;
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
  await deleteFromMyClass(userId, classList);
  return res.status(201).json({ message: 'class deleted from cart' });
};

const updateMyClassItemsController = async (req, res) => {
  const userId = req.params.id;
  const classId = req.query.classId;
  const progress = req.query.progress;
  if (
    isInputValid(userId, 'userId') &&
    isInputValid(classId, 'classId') &&
    isInputValid(progress, 'progress')
  ) {
    await updateProgressOfMyClass(userId, classId, progress);
    return res.status(201).json({ message: 'progress updated ' });
  } else {
    const msg =
      'INVALID_INPUT: userId, classId, progress MUST HAVE A SINGLE VALUE';
    const error = new Error(msg);
    error.statusCode = 400;
    throw error;
  }
};

module.exports = {
  getMyClassItemsController,
  addMyClassItemsController,
  deleteMyClassItemController,
  updateMyClassItemsController,
};
