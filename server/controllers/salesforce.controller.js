const errorHandler = require("../utils/errorHandler");
syncUserToSalesforce = require('../services/salesforce.service')

module.exports.syncToSalesforce = async (req, res) => {
  try {
    const result = await syncUserToSalesforce.syncToSalesforce(req)
    res.status(200).json(result);
    
  } catch (error) {
    errorHandler(res, error);
  }
};