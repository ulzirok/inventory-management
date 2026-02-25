const prisma = require("../prisma");
const errorHandler = require("../utils/errorHandler");

module.exports.getTopTags = async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: { inventories: true }
        }
      },
      where: {
        inventories: { some: {} }
      },
      take: 30
    });

    res.status(200).json(tags);
  } catch (error) {
    errorHandler(res, error);
  }
};
