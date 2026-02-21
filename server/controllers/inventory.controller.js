const prisma = require('../prisma');
const errorHandler = require('../utils/errorHandler')

module.exports.getAll = async (req, res) => {
  try {
    const inventories = await prisma.inventory.findMany()
    res.status(200).json(inventories)
    
  } catch (error) {
    errorHandler(res, error)
  }
};

module.exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const inventory = await prisma.inventory.findUnique({
      where: { id: Number(id) }
    })
    res.status(200).json(inventory)
  } catch (error) {
    errorHandler(res, error)
  }
};

module.exports.create = async (req, res) => {
  const data = req.body
  try {
    const inventory = await prisma.inventory.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        imageUrl: data.imageUrl,
        authorId: req.user.id
      }
    })
    
    res.status(201).json({ id: inventory.id })
  } catch (error) {
    errorHandler(res, error)
  }
};

module.exports.update = async (req, res) => {
  try {
    const { id } = req.params; 
    const { version, ...fields } = req.body;
    
    const updatedInventory = await prisma.inventory.update({ 
      where: {
        id: Number(id),
        version: version 
      }, 
      data: {
        ...fields, // Сюда придут из фронта {str1_label: "Автор", int1_label: null}
        version: { increment: 1 } //с фронта придет текущая version inventory и инкремент-ся (optimisticblock)
      }
    });
    res.status(200).json(updatedInventory);
    
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(409).json({
        message: "Inventory was modified by another user. Refresh the page."
      });
    }
    errorHandler(res, error);
  }
};

module.exports.delete = async (req, res) => {
  const { id } = req.params; 
  try {
    await prisma.inventory.delete({
      where: {
        id: Number(id)
      }
    })
    return res.status(200).json({ message: 'Inventory removed'})
    
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Inventory not found' });
    }
    errorHandler(res, error)
  }
};

module.exports.search = async (req, res) => {
  try {
    
  } catch (error) {
    errorHandler(res, error)
  }
};

module.exports.getLatest = async (req, res) => {
  try {
    
  } catch (error) {
    errorHandler(res, error)
  }
};
module.exports.getTop = async (req, res) => {
  try {
    
  } catch (error) {
    errorHandler(res, error)
  }
};



