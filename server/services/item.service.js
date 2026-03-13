const roles = require("../constants/roles");
const prisma = require("../prisma");
const generateCustomId = require("../utils/idGenerator");
const createError = require("../utils/createError");
const {
  checkPermission,
  findInventoryOrThrow
} = require('../helpers/items.helpers')

module.exports.getItems = async (req) => {
  const inventoryId = Number(req.params.inventoryId);

  const where = req.user.role === roles.ADMIN ? { inventoryId } : {
    inventoryId,
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
  return items;
};

module.exports.getItemsPublic = async (req) => {
  const inventoryId = Number(req.params.inventoryId);

  const items = await prisma.item.findMany({
    where: { inventoryId },
    orderBy: { updatedAt: "desc" }
  });
  return items;
};

module.exports.create = async (req) => {
  const inventoryId = Number(req.params.inventoryId);
  const { ...data } = req.body;

  const inventory = await findInventoryOrThrow(inventoryId, req.user)
  const customId = await generateCustomId(inventory.idFormat, inventoryId, prisma);

  const item = await prisma.item.create({
    data: {
      ...data,
      customId,
      inventoryId,
      authorId: req.user.id,
    },
  });
  return item;
};

module.exports.update = async (req) => {
  const { id } = req.params; //string
  const { version, ...updatedData } = req.body;

  const item = await prisma.item.findUnique({
    where: { id },
    include: { inventory: true }
  });

  if (!item) throw createError("Item not found", 404);

  checkPermission(item, req.user);

  const updated = await prisma.item.update({
    where: { id, version: Number(version) },
    data: {
      ...updatedData,
      version: { increment: 1 }
    },
  });
  return updated;
};

module.exports.delete = async (req) => {
  const { ids } = req.body; //string[]

  if (!ids || ids.length === 0) throw createError("No items selected", 400);

  const where = req.user.role === roles.ADMIN ? { id: { in: ids } } : {
    id: { in: ids },
    OR: [
      { authorId: req.user.id },
      { inventory: { authorId: req.user.id } }
    ]
  };

  const deleted = await prisma.item.deleteMany({ where });
  if (deleted.count === 0) throw createError("No items deleted. Check permissions.", 403);

  return { message: "Item removed" };
};