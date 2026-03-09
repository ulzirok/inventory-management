const prisma = require("../prisma");
const errorHandler = require("../utils/errorHandler");
const imagekit = require('../imageKit.config.js');
const roles = require("../constants/roles");

module.exports.getAll = async (req, res) => {
  try {
    const inventories = await prisma.inventory.findMany({
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

module.exports.getMy = async (req, res) => {
  try {
    const inventories = await prisma.inventory.findMany({
      where: {
        authorId: Number(req.user.id)
      },
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

module.exports.getShared = async (req, res) => {
  try {
    const inventories = await prisma.inventory.findMany({
      where: {
        isPublic: true,
        authorId: {not: Number(req.user.id)}
      },
      include: {
        category: true,
        tags: true,
        author: { select: { name: true, email: true } },
        _count: { select: { items: true } }
      },
      orderBy: { updatedAt: "desc" }
    })
    res.status(200).json(inventories)
  } catch (error) {
    errorHandler(res, error);
  }
}

module.exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const inventory = await prisma.inventory.findUnique({
      where: { id: Number(id) },
    });
    res.status(200).json(inventory);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.create = async (req, res) => {
  try {
    let { title, description, categoryId, tags, idFormat, ...customLabels } = req.body;
    if (!title || !categoryId || !description) {
      return res.status(400).json({
        message: "Please fill in the required fields."
      });
    }
    
    let imageUrl = ''; 
    let tagsArray = [];
    
    if (Array.isArray(tags)) {
      tagsArray = tags;
    } else if (typeof tags === 'string' && tags.trim() !== '') {
      tagsArray = [tags];
    }
    
    if (req.file) {
      const uploadResponse = await imagekit.upload({
        file: req.file.buffer,
        fileName: `inventory_${Date.now()}`,
      });
      imageUrl = uploadResponse.url;
    }
    
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
          connectOrCreate: tagsArray.map((tagName) => ({
            where: { name: tagName },
            create: { name: tagName },
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
    const invId = Number(id);
    let { version, categoryId, tags, title, description, isPublic, idFormat, ...customLabels } = req.body;
    let imageUrl = req.body.imageUrl; 
    
    const inventory = await prisma.inventory.findUnique({ where: { id: invId } });
    if (!inventory) return res.status(404).json({ message: "Inventory not found" });

    const isAdmin = req.user.role === roles.ADMIN;
    if (inventory.authorId !== req.user.id && !isAdmin) {
      return res.status(403).json({ message: "No access to update this inventory" });
    }
    
    const updatePayload = {
      title,
      description,
      ...customLabels,
      version: { increment: 1 },
    };
    
    if (isPublic !== undefined) {
      updatePayload.isPublic = isPublic === 'true' || isPublic === true;
    }
    
    if (idFormat) {
      updatePayload.idFormat = idFormat;
    }
    
    if (req.file) {
      const uploadResponse = await imagekit.upload({
        file: req.file.buffer,
        fileName: `update_${Date.now()}`,
      });
      updatePayload.imageUrl = uploadResponse.url;
    }
    
    if (categoryId) {
      updatePayload.category = { connect: { id: Number(categoryId) } };
    }

    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : [tags];
      updatePayload.tags = {
        set: [],
        connectOrCreate: tagsArray.map((tagName) => ({
          where: { name: tagName },
          create: { name: tagName },
        })),
      };
    }

    const updatedInventory = await prisma.inventory.update({
      where: { id: Number(id), version: Number(version) },
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
  try {
    const { ids } = req.body;
    
    const idArray = ids.map(id => Number(id));
    const where = req.user.role === roles.ADMIN
      ? { id: { in: idArray } }
      : { id: { in: idArray }, authorId: req.user.id };

    const deleted = await prisma.inventory.deleteMany({ where });

    if (deleted.count === 0) return res.status(403).json({ message: "Access denied or not found" });
    
    if (!ids || ids.length === 0) return res.status(400).json({ message: "No inventories selected" });

    await prisma.inventory.deleteMany({
      where: {
        id: { in: ids.map((id) => Number(id)) }
      },
    });
    return res.status(200).json({ message: "Inventories deleted" });
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
      take: 5,
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

