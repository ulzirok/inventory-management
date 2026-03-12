const prisma = require("../prisma");
const Roles = require("../constants/roles");
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

module.exports.getAll = async (req) => {
  const { search = '' } = req.query;
  const where = search ? {
    OR: [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ],
  } : {};

  return findUsers(where, req.query)
};

module.exports.getUserById = async (req) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBlocked: true
    }
  });
  
  return user;
};

module.exports.changeStatus = async (req) => {
  const { ids, isBlocked } = req.body;

  await prisma.user.updateMany({
    where: { id: { in: ids.map((id) => Number(id)) } },
    data: { isBlocked },
  });

  return { message: `Status updated to ${isBlocked ? "block" : "active"}` };
};

module.exports.changeRole = async (req) => {
  const { ids, role } = req.body;

  await prisma.user.updateMany({
    where: { id: { in: ids.map((id) => Number(id)) } },
    data: { role },
  });

  return { message: `Role changed to ${role}` };
};

module.exports.delete = async (req) => {
  const { ids } = req.body;

  await prisma.user.deleteMany({
    where: { id: { in: ids.map((id) => Number(id)) } },
  });
  
  return { message: "Users deleted" };
};