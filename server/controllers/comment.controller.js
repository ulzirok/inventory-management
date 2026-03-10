const prisma = require("../prisma");
const errorHandler = require("../utils/errorHandler");

module.exports.getMessages = async (req, res) => {
  try {
    const { inventoryId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { inventoryId: Number(inventoryId) },
      include: { author: { select: { id: true, name: true } } },
      orderBy: { createdAt: "asc" },
    });
    res.status(200).json(comments);
  } catch (error) {
    errorHandler(res, error);
  }
};
