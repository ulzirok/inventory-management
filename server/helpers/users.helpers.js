const prisma = require("../prisma");

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
        isBlocked: true
      },
      orderBy: { [sort]: order },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    }),
    prisma.user.count({ where })
  ]);

  return { data, total };
}

module.exports = { findUsers }