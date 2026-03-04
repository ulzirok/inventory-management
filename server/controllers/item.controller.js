const prisma = require("../prisma");
const errorHandler = require("../utils/errorHandler");
const generateCustomId = require("../utils/idGenerator");

module.exports.getByInventoryId = async (req, res) => {
  try {
    const { inventoryId } = req.params;
    
    const item = await prisma.item.findMany({
      where: {
        inventoryId: Number(inventoryId),
        authorId: Number(req.user.id)
      },
    });
    res.status(200).json(item);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.getPublic = async (req, res) => {
  try {
    const { inventoryId } = req.params;
    
    const item = await prisma.item.findMany({
      where: { inventoryId: Number(inventoryId) },
    });
    res.status(200).json(item);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.create = async (req, res) => {
  try {
    const { inventoryId } = req.params;
    const { ...data } = req.body;
    
    const inventory = await prisma.inventory.findUnique({
      where: {
        id: Number(inventoryId),
        authorId: Number(req.user.id)
      },
    });
    if (!inventory)
      return res.status(404).json({ message: "Inventory not found" });
    const customId = await generateCustomId(
      inventory.idFormat,
      Number(inventoryId),
      prisma,
    );

    const item = await prisma.item.create({
      data: {
        ...data,
        customId,
        inventoryId: Number(inventoryId),
        authorId: req.user.id,
      },
    });
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
    const { id } = req.params;
    const { version, ...updatedData } = req.body;
    
    const updatedItem = await prisma.item.update({
      where: {
        id: id,
        authorId: Number(req.user.id),
        version: Number(version)
      },
      data: { ...updatedData, version: { increment: 1 },
      },
    });
    res.status(200).json(updatedItem);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(409).json({ message: "Item was modified by another user. Refresh the page." });
    }
    errorHandler(res, error);
  }
};

module.exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.item.delete({
      where: {
        id: id,
        authorId: Number(req.user.id)
      },
    });
    return res.status(200).json({ message: "Item removed" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Item not found" });
    }
    errorHandler(res, error);
  }
};
