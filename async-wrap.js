function asyncWrap(asyncController) {
  return async (req, res, next) => {
    try {
      await asyncController(req, res);
    } catch (error) {
      next(error);
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };
}

module.exports = asyncWrap;
