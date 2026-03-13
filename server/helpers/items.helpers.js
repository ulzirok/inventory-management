const roles = require("../constants/roles");
const prisma = require("../prisma");
const createError = require("../utils/createError");

function checkPermission(item, user) {
  const isAdmin = user.role === roles.ADMIN;
  const isAuthor = item.authorId === user.id;
  const isInvOwner = item.inventory.authorId === user.id;
  if (!isAdmin && !isAuthor && !isInvOwner) {
    throw createError("No access to update this item", 403);
  }
}

async function findInventoryOrThrow(inventoryId, user) {
  const inventory = await prisma.inventory.findFirst({
    where: user.role === roles.ADMIN ? { id: inventoryId } : {
      id: inventoryId,
      OR: [
        { authorId: user.id },
        { isPublic: true }
      ]
    },
  });
  if (!inventory) throw createError("Inventory not found or private", 403);
  return inventory;
}

module.exports = {
  checkPermission,
  findInventoryOrThrow
};