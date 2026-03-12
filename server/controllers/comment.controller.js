const errorHandler = require("../utils/errorHandler");
const commentService = require('../services//comment.service')

module.exports.getMessages = async (req, res) => {
  try {
    const comments = await commentService.getMessages(req)
    res.status(200).json(comments);
    
  } catch (error) {
    errorHandler(res, error);
  }
};
