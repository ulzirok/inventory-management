const prisma = require("../prisma");
const createError = require("../utils/createError");

async function findUsers(where, query) {
  const { sort = 'id', order = 'desc', page = 1, limit = 10 } = query;

  const [data, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isBlocked: true,
        salesforceId: true
      },
      orderBy: { [sort]: order },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    }),
    prisma.user.count({ where })
  ]);

  return { data, total };
}

const checkNotSyncedSF = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) throw createError("User not found", 404);

  if (user.salesforceId) {
    throw createError("You are already synced with Salesforce.", 409);
  }

  return user;
};

const getSFIds = async (userIds) => {
  const users = await prisma.user.findMany({
    where: {
      id: { in: userIds },
      salesforceId: { not: null }
    },
    select: { salesforceId: true }
  });

  return users.map(u => u.salesforceId);
};

module.exports = { findUsers, checkNotSyncedSF, getSFIds }