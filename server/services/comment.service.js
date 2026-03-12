const prisma = require("../prisma");

module.exports.getMessages = async (req) => {
  const { inventoryId } = req.params;

  const comments = await prisma.comment.findMany({
    where: { inventoryId: Number(inventoryId) },
    include: { author: { select: { id: true, name: true } } },
    orderBy: { createdAt: "asc" },
  });
  
  return comments;
};