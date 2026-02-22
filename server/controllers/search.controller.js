const prisma = require('../prisma');
const errorHandler = require('../utils/errorHandler');

module.exports.search = async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(200).json([]);
  try {
    const searchResult = await prisma.inventory.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { items: { some: { string_1: { contains: query, mode: 'insensitive' } } } },
          { tags: { some: { name: { contains: query, mode: 'insensitive' } } } }
        ]
      },
      include: { author: { select: { name: true } }, tags: true, _count: { select: { items: true } } }
    });
    res.status(200).json(searchResult);
  } catch (error) {
    errorHandler(res, error);
  }
};
