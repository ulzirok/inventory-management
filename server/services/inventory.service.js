const prisma = require("../prisma");
const imagekit = require('../imageKit.config.js');
const roles = require("../constants/roles");
const createError = require("../utils/createError");

const inventoryInclude = {
  category: true,
  tags: true,
  author: { select: { name: true, email: true } },
  _count: { select: { items: true } }
};

function getSearchWhere(query) {
  const { search = '' } = query;
  if (!search) return {};
  return {
    OR: [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { category: { name: { contains: search, mode: 'insensitive' } } },
    ],
  };
}

async function findInventories(where, query) {
  const { sort = 'updatedAt', order = 'desc', page = 1, limit = 10 } = query;
  const [data, total] = await prisma.$transaction([
    prisma.inventory.findMany({
      where,
      include: inventoryInclude,
      orderBy: { [sort]: order },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    }),
    prisma.inventory.count({ where })
  ]);
  return { data, total };
}

async function uploadFile(file) {
  if (!file) return;
  const uploadResponse = await imagekit.upload({
    file: file.buffer,
    fileName: `inventory_${Date.now()}`,
  });
  return uploadResponse.url;
}

function formatTags(tags) {
  if (!tags) return [];
  const tagsArray = Array.isArray(tags) ? tags : [tags];
  return tagsArray.map(tagName => ({
    where: { name: tagName },
    create: { name: tagName }
  }));
}

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

  const inventory = await prisma.inventory.findUnique({
    where: { id: inventoryId }
  });
  if (!inventory) throw createError("Inventory not found", 404);

  const isAdmin = req.user.role === roles.ADMIN;
  if (inventory.authorId !== req.user.id && !isAdmin) throw createError("No access to update this inventory", 403);

  const updatePayload = {
    title,
    description,
    ...customLabels,
    version: { increment: 1 },
  };

  if (idFormat) updatePayload.idFormat = idFormat;
  if (req.file) updatePayload.imageUrl = await uploadFile(req.file);
  if (categoryId) updatePayload.category = { connect: { id: Number(categoryId) } };

  if (tags) {
    updatePayload.tags = {
      set: [],
      connectOrCreate: formatTags(tags),
    };
  }

  if (isPublic !== undefined) {
    updatePayload.isPublic = isPublic === 'true' || isPublic === true;
  }

  const updatedInventory = await prisma.inventory.update({
    where: { id: Number(id), version: Number(version) },
    data: updatePayload,
    include: { tags: true },
  });
  return updatedInventory;
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