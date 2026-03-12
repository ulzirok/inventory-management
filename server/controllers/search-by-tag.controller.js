const errorHandler = require("../utils/errorHandler");
searchByTagService = require('../services/search-by-tag.service')

module.exports.searchByTag = async (req, res) => {
  try {
    const { tag } = req.query;
    if (!tag) return res.status(200).json([]);
    
    const result = await searchByTagService.searchByTag(tag)
    res.status(200).json(result);
    
  } catch (error) {
    errorHandler(res, error);
  }
};
