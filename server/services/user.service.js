const prisma = require("../prisma");
const { findUsers, getSFIds } = require('../helpers/users.helpers')
const { deleteContactsFromSF } = require('../helpers/salesforce.helpers');

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
      isBlocked: true,
      salesforceId: true
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
  const userIds = ids.map((id) => Number(id));

  const sfIds = await getSFIds(userIds);
  try {
    if (sfIds.length > 0) {
      await deleteContactsFromSF(sfIds);
    }
  } catch (error) {
    console.error(error.message);
  }

  await prisma.user.deleteMany({
    where: { id: { in: userIds } },
  });

  return { message: "Users deleted" };
};
