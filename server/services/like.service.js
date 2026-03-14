const prisma = require("../prisma.js");

module.exports.like = async (req) => {
  const { id } = req.params;
  const userId = Number(req.user.id);

  const existingLike = await prisma.like.findUnique({
    where: { userId_itemId: { userId, itemId: id } }
  });

  if (existingLike) {
    await prisma.like.delete({ where: { userId_itemId: { userId, itemId: id } } });
    return { liked: false };
  }

  await prisma.like.create({
    data: { userId, itemId: id }
  });

  return { liked: true };
};