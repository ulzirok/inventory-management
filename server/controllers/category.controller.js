const errorHandler = require("../utils/errorHandler");
const categoryService = require('../services//category.service')

module.exports.getAll = async (req, res) => {
  try {
    const categories = await categoryService.getAll()
    res.status(200).json(categories);
  } catch (error) {
    errorHandler(res, error);
  }
};
