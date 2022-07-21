const {
  getMyClassItems,
  addToMyClass,
  deleteFromMyClass,
  updateProgressOfMyClass,
} = require('../services/myClasses');

const isClassListInputValid = (classList, str) => {
  console.log('isClassValid: ', str, ' ', classList);
  if (classList == null || classList.length === 0 || classList === '') {
    console.log(`INVALID_INPUT: classId=undefined or null`);
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
    if (
      !(
        input == null ||
        input.toLowerCase() === 'class_name' ||
        input.toLowerCase() === 'created_at'
      )
    ) {
      console.log(`INVALID_INPUT: ${input} is not valid sort option.`);
      return false;
    } else {
      if (input.split(',') > 1 || typeof input !== 'string') {
        console.log(`INVALID_INPUT: ${str} = ${input}`);
        return false;
      }
    }
  }

  return true;
};

const getMyClassItemsController = async (req, res) => {
  const user = req.user;
  const searchParams = new URLSearchParams(req.query);
  const sort = searchParams.get('sort');
  if (isInputValid(sort, 'sort')) {
    const items = await getMyClassItems(user.id, sort);
    return res.status(200).json({ data: items });
  } else {
    const msg = 'INVALID_INPUT: sort option NOT VALID';
    const error = new Error(msg);
    error.statusCode = 400;
    throw error;
  }
};

const addMyClassItemsController = async (req, res) => {
  const user = req.user;
  const classList = req.body;
  if (isClassListInputValid(classList, 'classList')) {
    await addToMyClass(user.id, classList);
    return res.status(201).json({ message: 'class added into my classes' });
  } else {
    const msg = 'INVALID_INPUT: classList is NOT VALID';
    const error = new Error(msg);
    error.statusCode = 400;
    throw error;
  }
};

const deleteMyClassItemController = async (req, res) => {
  const user = req.user;
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
  await deleteFromMyClass(user.id, classList);
  return res.status(201).json({ message: 'class deleted from cart' });
};

const updateMyClassItemsController = async (req, res) => {
  const user = req.user;
  const classId = req.query.classId;
  const progress = req.query.progress;
  if (isInputValid(classId, 'classId') && isInputValid(progress, 'progress')) {
    await updateProgressOfMyClass(user.id, classId, progress);
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
