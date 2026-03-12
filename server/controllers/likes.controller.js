const errorHandler = require("../utils/errorHandler.js");
const likeService = require('../services/like.service.js')

module.exports.like = async (req, res) => {
  try {
    const result = await likeService.like(req)
    res.status(201).json(result);
    
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "You already liked this item." });
    }
    errorHandler(res, error);
  }
};
