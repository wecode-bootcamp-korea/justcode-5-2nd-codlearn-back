const {getMainDetailFree, getMainDetailIntro, getSearchList } = require('../models/main');

const readMainPage = async (req, res) => {
  try {

    let result; 
    const courseFree = await getMainDetailFree();
    const courseIntro = await getMainDetailIntro();
    const searchQuery = req.query.s;
    const searchList = await getSearchList(searchQuery); 
    const obj1 = {free15: courseFree}
    const obj2 ={intro15: courseIntro}
    const obj3 ={searchData: searchList}
    if(!searchQuery)
    {result = Object.assign(obj1,obj2); }
    else {
     result = obj3; 
    }

     
    return res.status(200).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

module.exports = {
    readMainPage
  };