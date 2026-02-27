const prisma = require("../prisma");
const errorHandler = require("../utils/errorHandler");
const Roles = require("../constants/roles");

module.exports.getAll = async (req, res) => {
  try {
    let isAdmin = {};

    if (req.user.role !== Roles.ADMIN) {
      isAdmin.authorId = req.user.id;
    }

    const inventories = await prisma.inventory.findMany({
      where: isAdmin,
      include: {
        category: true,
        tags: true,
        author: { select: { name: true, email: true } },
        _count: { select: { items: true } }
      },
      orderBy: { updatedAt: "desc" }
    });
    res.status(200).json(inventories);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const inventory = await prisma.inventory.findUnique({
      where: { id: Number(id) },
    });
    res.status(200).json(inventory);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.create = async (req, res) => {
  const {
    title,
    description,
    categoryId,
    tags,
    imageUrl,
    idFormat,
    ...customLabels
  } = req.body;
  try {
    const inventory = await prisma.inventory.create({
      data: {
        title,
        description,
        imageUrl,
        idFormat,
        ...customLabels,
        author: { connect: { id: req.user.id } },
        category: { connect: { id: Number(categoryId) } },
        tags: {
          connectOrCreate: (tags || []).map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
      include: { tags: true },
    });

    res.status(201).json({ inventory });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { version, categoryId, tags, ...updatedData } = req.body;

    const updatePayload = {
      ...updatedData,
      version: { increment: 1 },
    };

    if (categoryId) {
      updatePayload.category = { connect: { id: Number(categoryId) } };
    }

    if (tags) {
      updatePayload.tags = {
        set: [],
        connectOrCreate: tags.map((tag) => ({
          where: { name: tag },
          create: { name: tag },
        })),
      };
    }

    const updatedInventory = await prisma.inventory.update({
      where: {
        id: Number(id),
        version: version,
      },
      data: updatePayload,
      include: { tags: true },
    });
    res.status(200).json(updatedInventory);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(409).json({ message: "Inventory was modified or not found." });
    }
    errorHandler(res, error);
  }
};

module.exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.inventory.delete({
      where: { id: Number(id) },
    });
    return res.status(200).json({ message: "Inventory removed" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Inventory not found" });
    }
    errorHandler(res, error);
  }
};

module.exports.getLatest = async (req, res) => {
  try {
    const latest = await prisma.inventory.findMany({
      orderBy: { updatedAt: "desc" },
      include: { author: { select: { name: true, email: true } }, category: true },
    });
    res.status(200).json(latest);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.getTop = async (req, res) => {
  try {
    const top = await prisma.inventory.findMany({
      take: 5,
      orderBy: {
        items: { _count: "desc" },
      },
      include: {
        _count: { select: { items: true } },
        author: { select: { name: true, email: true } },
      },
    });
    res.status(200).json(top);
  } catch (error) {
    errorHandler(res, error);
  }
};
