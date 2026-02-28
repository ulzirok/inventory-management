const prisma = require("../prisma");
const errorHandler = require("../utils/errorHandler");

module.exports.getTags = async (req, res) => {
  try {
    const query = req.query.search || '';
    
    const tags = await prisma.tag.findMany({
      where: {
        name: { contains: query, mode: 'insensitive'},
        inventories: { some: {} }
      },
      select: { id: true, name: true, _count: {select: { inventories: true } }},
      take: 30
    });

    res.status(200).json(tags);
  } catch (error) {
    errorHandler(res, error);
  }
};
