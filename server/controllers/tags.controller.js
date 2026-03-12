const errorHandler = require("../utils/errorHandler");
const tagsService = require('../services/tags.service')

module.exports.getTags = async (req, res) => {
  try {
    const tags = await tagsService.getTags(req)
    res.status(200).json(tags);
    
  } catch (error) {
    errorHandler(res, error);
  }
};
