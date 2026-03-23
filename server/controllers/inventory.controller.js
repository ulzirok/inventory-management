const errorHandler = require("../utils/errorHandler");
const inventoryService = require('../services/inventory.service')

module.exports.getAll = async (req, res) => {
  try {
    const result = await inventoryService.getAll(req.query)
    res.status(200).json(result);
    
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.getMy = async (req, res) => {
  try {
    const result = await inventoryService.getMy(req.query, req.user.id)
    res.status(200).json(result);
  
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.getShared = async (req, res) => {
  try {
    const result = await inventoryService.getShared(req.query, req.user.id)
    res.status(200).json(result);
    
  } catch (error) {
    errorHandler(res, error);
  }
}

module.exports.getById = async (req, res) => {
  try {
    const inventory = await inventoryService.getById(req)
    res.status(200).json(inventory);
    
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.create = async (req, res) => {
  try {
    const newInventory = await inventoryService.create(req)
    res.status(201).json(newInventory);
    
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.update = async (req, res) => {
  try {
    const updated = await inventoryService.update(req)
    res.status(200).json(updated);
    
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(409).json({ message: "Inventory was modified or not found." });
    }
    errorHandler(res, error);
  }
};

module.exports.delete = async (req, res) => {
  try {
    const result = await inventoryService.delete(req)
    return res.status(200).json(result);
    
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Inventory not found" });
    }
    errorHandler(res, error);
  }
};

module.exports.getLatest = async (req, res) => {
  try {
    const latest = await inventoryService.getLatest()
    res.status(200).json(latest);
    
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.getTop = async (req, res) => {
  try {
    const top = await inventoryService.getTop()
    res.status(200).json(top);
    
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.generateApiToken = async (req, res) => { //for odoo
  try {
    const result = await inventoryService.generateApiToken(req);
    res.status(200).json(result);

  } catch (error) {
    errorHandler(res, error);
  }
};
