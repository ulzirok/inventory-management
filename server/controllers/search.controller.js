const errorHandler = require("../utils/errorHandler");
const searchService = require('../services/search.service');

module.exports.search = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim().length < 1) return res.status(200).json([]);

    const result = await searchService.search(query);
    res.status(200).json(result);

  } catch (error) {
    console.error('FTS Search Error:', error);
    errorHandler(res, error);
  }
};
