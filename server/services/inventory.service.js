const prisma = require("../prisma");
const roles = require("../constants/roles");
const createError = require("../utils/createError");
const {
  inventoryInclude,
  getSearchWhere,
  findInventories,
  formatTags,
  findOrThrow,
  checkPermission,
  uploadFile,
  addImage,
  addIdFormat,
  addCategory,
  addTags,
  addAccess
} = require('../helpers/inventory.helpers');

module.exports.getAll = async (query) => {
  const where = getSearchWhere(query);
  return findInventories(where, query);
};

module.exports.getMy = async (query, userId) => {
  const where = {
    authorId: Number(userId),
    ...getSearchWhere(query)
  };
  return findInventories(where, query);
};

module.exports.getShared = async (query, userId) => {
  const where = {
    isPublic: true,
    authorId: { not: Number(userId) },
    ...getSearchWhere(query)
  };
  return findInventories(where, query);
};

module.exports.getById = async (req) => {
  const { id } = req.params;

  const inventory = await prisma.inventory.findUnique({
    where: { id: Number(id) },
  });
  return inventory;
};

module.exports.create = async (req) => {
  let { title, description, categoryId, tags, idFormat, ...customLabels } = req.body;
  if (!title || !categoryId || !description) throw createError("Please fill in the required fields.", 400);
  let imageUrl = await uploadFile(req.file);

  const inventory = await prisma.inventory.create({
    data: {
      title,
      description,
      imageUrl,
      idFormat,
      ...customLabels,
      author: { connect: { id: req.user.id } },
      category: { connect: { id: Number(categoryId) } },
      tags: { connectOrCreate: formatTags(tags) },
    },
    include: { tags: true },
  });
  return { inventory };
};

module.exports.update = async (req) => {
  const inventoryId = Number(req.params.id);
  let { version, categoryId, tags, title, description, isPublic, idFormat, ...customLabels } = req.body;

  const inventory = await findOrThrow(inventoryId)
  checkPermission(inventory, req.user)

  const payload = {
    title,
    description,
    ...customLabels,
    version: { increment: 1 },
  };

  addIdFormat(payload, idFormat)
  await addImage(payload, req.file)
  addCategory(payload, categoryId)
  addTags(payload, tags)
  addAccess(payload, isPublic)

  const updated = await prisma.inventory.update({
    where: { id: inventoryId, version: Number(version) },
    data: payload,
    include: { tags: true },
  });
  return updated;
};

module.exports.delete = async (req) => {
  const { ids } = req.body;
  if (!ids || ids.length === 0) throw createError("No inventories selected", 400);
  const idArray = ids.map(id => Number(id));
  const where = req.user.role === roles.ADMIN ? { id: { in: idArray } } : { id: { in: idArray }, authorId: req.user.id };

  const deleted = await prisma.inventory.deleteMany({ where });
  if (deleted.count === 0) throw createError("Access denied or not found", 403);
  return { message: "Inventories deleted" };
};

module.exports.getLatest = async () => {
  const latest = await prisma.inventory.findMany({
    take: 5,
    orderBy: { updatedAt: "desc" },
    include: inventoryInclude,
  });
  return latest;
};

module.exports.getTop = async () => {
  const top = await prisma.inventory.findMany({
    take: 5,
    orderBy: { items: { _count: "desc" } },
    include: inventoryInclude,
  });
  return top;
};