const roles = require("../constants/roles");
const prisma = require("../prisma");
const errorHandler = require("../utils/errorHandler");
const generateCustomId = require("../utils/idGenerator");

module.exports.getByInventoryId = async (req, res) => {
  try {
    const { inventoryId } = req.params;
    const invId = Number(inventoryId);
    
    const where = req.user.role === roles.ADMIN ? { inventoryId: invId } : {
        inventoryId: invId,
        OR: [
          { authorId: req.user.id },
          { inventory: { isPublic: true } },
          { inventory: { authorId: req.user.id } }
        ]
      };
    
    const items = await prisma.item.findMany({
      where,
      orderBy: { updatedAt: "desc" }
    });
    res.status(200).json(items);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.getPublic = async (req, res) => {
  try {
    const { inventoryId } = req.params;
    
    const items = await prisma.item.findMany({
      where: { inventoryId: Number(inventoryId) },
      orderBy: { updatedAt: "desc" }
    });
    res.status(200).json(items);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.create = async (req, res) => {
  try {
    const { inventoryId } = req.params;
    const { ...data } = req.body;
    const invId = Number(inventoryId);
    
    const inventory = await prisma.inventory.findFirst({
      where: req.user.role === roles.ADMIN
        ? { id: invId }
        : {
          id: invId,
          OR: [
            { authorId: req.user.id },
            { isPublic: true }
          ]
        },
    });
    if (!inventory) return res.status(403).json({ message: "Inventory not found or private" });
    
    const customId = await generateCustomId(inventory.idFormat, invId, prisma);

    const item = await prisma.item.create({
      data: {
        ...data,
        customId,
        inventoryId: invId,
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
    
    const item = await prisma.item.findUnique({
      where: { id },
      include: { inventory: true }
    });
    
    if (!item) return res.status(404).json({ message: "Item not found" });
    
    const isAdmin = req.user.role === roles.ADMIN;
    const isAuthor = item.authorId === req.user.id;
    const isInvOwner = item.inventory.authorId === req.user.id;

    if (!isAdmin && !isAuthor && !isInvOwner) {
      return res.status(403).json({ message: "No access to update this item" });
    }
    
    const updatedItem = await prisma.item.update({
      where: {
        id,
        version: Number(version)
      },
      data: {
        ...updatedData,
        version: { increment: 1 }
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
    const { ids } = req.body;
    
    if (!ids || ids.length === 0) return res.status(400).json({ message: "No items selected" });
    
    const where = req.user.role === roles.ADMIN
      ? { id: { in: ids } }
      : {
        id: { in: ids },
        OR: [
          { authorId: req.user.id },
          { inventory: { authorId: req.user.id } }
        ]
      };
    
    const deleted = await prisma.item.deleteMany({ where });
    if (deleted.count === 0) return res.status(403).json({ message: "No items deleted. Check permissions." });
    
    return res.status(200).json({ message: "Item removed" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Item not found" });
    }
    errorHandler(res, error);
  }
};
