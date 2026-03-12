const prisma = require("../prisma");

module.exports.searchByTag = async (tag) => {
  const result = await prisma.inventory.findMany({
    where: {
      tags: { some: { name: tag } }
    },
    include: { author: true, tags: true }
  });
  return result;
};