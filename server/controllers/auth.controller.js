const errorHandler = require("../utils/errorHandler");
const authService = require("../services/auth.service");

module.exports.register = async (req, res) => {
  try {
    const result = await authService.register(req)
    res.status(201).json(result);
    
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "This email is already registered. Try a different email."
      });
    }
    errorHandler(res, error);
  }
};

module.exports.login = async (req, res) => {
  try {
    const result = await authService.login(req)
    res.status(200).json(result);
    
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.getProfile = async (req, res) => {
  try {
    const user = await authService.getProfile(req)
    res.status(200).json(user);
    
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.socialCallback = async (req, res) => {
  try {
    const clientUrl = await authService.socialCallback(req)
    res.redirect(clientUrl);
    
  } catch (error) {
    errorHandler(res, error);
  }
};
