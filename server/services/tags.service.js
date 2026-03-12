const prisma = require("../prisma");

module.exports.getTags = async (req) => {
  const query = req.query.search || '';

  const tags = await prisma.tag.findMany({
    where: {
      name: { contains: query, mode: 'insensitive' },
      inventories: { some: {} }
    },
    select: { id: true, name: true, _count: { select: { inventories: true } } },
    take: 20
  });

  return tags;
};