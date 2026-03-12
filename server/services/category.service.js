const prisma = require("../prisma");

module.exports.getAll = async () => {
  const categories = await prisma.category.findMany();
  return categories;
};