const errorHandler = require("../utils/errorHandler");
odooService = require('../services/odoo.service')

module.exports.getInventoryStats = async (req, res) => {
  try {
    const result = await odooService.getInventoryStats(req);
    res.status(200).json(result);

  } catch (error) {
    errorHandler(res, error);
  }
};