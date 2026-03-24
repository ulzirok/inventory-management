const errorHandler = require("../utils/errorHandler");
powerAutomateService = require('../services/power-automate.service')

module.exports.createTicket = async (req, res) => {
  try {
    const result = await powerAutomateService.createTicket(req);
    res.status(200).json({
      message: 'Ticket created successfully',
      result
    });

  } catch (error) {
    errorHandler(res, error);
  }
};