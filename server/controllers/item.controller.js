const itemService = require('../services/item.service');
const errorHandler = require("../utils/errorHandler");

module.exports.getItems = async (req, res) => {
  try {
    const items = await itemService.getItems(req);
    res.status(200).json(items);

  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.getItemsPublic = async (req, res) => {
  try {
    const items = await itemService.getItemsPublic(req);
    res.status(200).json(items);

  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.getItem = async (req, res) => {
  try {
    const item = await itemService.getItem(req);
    res.status(200).json(item);

  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.create = async (req, res) => {
  try {
    const item = await itemService.create(req);
    res.status(201).json(item);

  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Custom ID conflict. Try again." });
    }
    errorHandler(res, error);
  }
};

module.exports.update = async (req, res) => {
  try {
    const update = await itemService.update(req);
    res.status(200).json(update);

  } catch (error) {
    if (error.code === "P2025") {
      return res.status(409).json({ message: "Item was modified or not found." });
    }
    errorHandler(res, error);
  }
};

module.exports.delete = async (req, res) => {
  try {
    const result = await itemService.delete(req);
    return res.status(200).json(result);

  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Item not found" });
    }
    errorHandler(res, error);
  }
};
