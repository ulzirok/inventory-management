const prisma = require("../prisma");
const errorHandler = require("../utils/errorHandler");

module.exports.searchByTag = async (req, res) => {
  const { tag } = req.query;
  if (!tag) return res.status(200).json([]);
  try {
    const results = await prisma.inventory.findMany({
      where: {
        tags: { some: { name: tag } }
      },
      include: { author: true, tags: true }
    });
    res.status(200).json(results);
  } catch (error) {
    errorHandler(res, error);
  }
};
