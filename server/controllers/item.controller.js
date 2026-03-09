const roles = require("../constants/roles");
const prisma = require("../prisma");
const errorHandler = require("../utils/errorHandler");
const generateCustomId = require("../utils/idGenerator");

module.exports.getByInventoryId = async (req, res) => {
  try {
    const { inventoryId } = req.params;
    
    let whereCondition = {
      inventoryId: Number(inventoryId)
    };
    
    if (req.user.role !== roles.ADMIN) {
      whereCondition.authorId = req.user.id;
    }
    
    const item = await prisma.item.findMany({
      where: whereCondition,
      orderBy: { updatedAt: "desc" }
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
      orderBy: { updatedAt: "desc" }
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
    
    const inventory = await prisma.inventory.findFirst({
      where: {
        id: Number(inventoryId),
        OR: [
          { authorId: Number(req.user.id) },
          { isPublic: true },
          { author: { role: req.user.role } }
        ]
      },
    });
    if (!inventory) return res.status(403).json({ message: "Inventory not found or private" });
    
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
        version: Number(version),
        OR: [
          { authorId: Number(req.user.id) },
          { inventory: { isPublic: true } },
          { inventory: { authorId: Number(req.user.id) } },
          { author: { role: req.user.role } }
        ]
      },
      data: { ...updatedData, version: { increment: 1 }},
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
    const { ids } = req.body;
    
    if (!ids || ids.length === 0) return res.status(400).json({ message: "No items selected" });
    
    await prisma.item.deleteMany({
      where: {
        id: {in: ids},
        OR: [
          { authorId: Number(req.user.id) },
          { inventory: { isPublic: true } },
          { author: { role: req.user.role } }
        ]
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
