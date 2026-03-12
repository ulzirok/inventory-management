const errorHandler = require("../utils/errorHandler");
const userService = require('../services/user.service');
const Roles = require("../constants/roles");

module.exports.getAll = async (req, res) => {
  try {
    if (req.user.role !== Roles.ADMIN) return res.status(403).json({ message: "Access denied. Admins only." });

    const result = await userService.getAll(req);
    res.status(200).json(result);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req);
    res.status(200).json(user);
    
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.changeStatus = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || ids.length === 0)
      return res.status(400).json({ message: "No users selected" });
    
    const result = await userService.changeStatus(req);
    res.status(200).json(result);

  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.changeRole = async (req, res) => {
  try {
    const result = await userService.changeRole(req);
    res.status(200).json(result);
    
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.delete = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || ids.length === 0) return res.status(400).json({ message: "No users selected" });
    
    const result = await userService.delete(req);
    res.status(200).json(result);
  } catch (error) {
    errorHandler(res, error);
  }
};
