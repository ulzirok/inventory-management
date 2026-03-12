const prisma = require("../prisma.js");

module.exports.like = async (req) => {
  const { itemId } = req.params;

  await prisma.like.create({
    data: { itemId, userId: req.user.id },
  });
  
  return { message: "Liked" };
};