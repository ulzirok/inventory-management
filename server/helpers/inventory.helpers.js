const prisma = require('../prisma');
const createError = require('http-errors');
const roles = require('../constants/roles');
const imagekit = require('../imageKit.config.js');

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

function formatTags(tags) {
  if (!tags) return [];
  const tagsArray = Array.isArray(tags) ? tags : [tags];
  return tagsArray.map(tagName => ({
    where: { name: tagName },
    create: { name: tagName }
  }));
}

async function findOrThrow(id) {
  const inventory = await prisma.inventory.findUnique({
    where: { id }
  });
  if (!inventory) throw createError("Inventory not found", 404);
  return inventory;
}

function checkPermission(inventory, user) {
  const isAdmin = user.role === roles.ADMIN;
  if (inventory.authorId !== user.id && !isAdmin) {
    throw createError("No access to update this inventory", 403);
  }
}

async function uploadFile(file) {
  if (!file) return;
  const uploadResponse = await imagekit.upload({
    file: file.buffer,
    fileName: `inventory_${Date.now()}`,
  });
  return uploadResponse.url;
}

async function addImage(payload, file) {
  if (!file) return;
  payload.imageUrl = await uploadFile(file);
}

function addIdFormat(payload, idFormat) {
  if (!idFormat) return;
  payload.idFormat = idFormat;
}

function addCategory(payload, categoryId) {
  if (!categoryId) return;
  payload.category = { connect: { id: Number(categoryId) } };
}

function addTags(payload, tags) {
  if (!tags) return;
  payload.tags = {
    set: [],
    connectOrCreate: formatTags(tags),
  };
}

function addAccess(payload, isPublic) {
  if (isPublic === undefined) return;
  payload.isPublic = isPublic === 'true' || isPublic === true;
}

module.exports = {
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
};