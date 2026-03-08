const prisma = require("../prisma");
const errorHandler = require("../utils/errorHandler");
const Roles = require("../constants/roles");

module.exports.getAll = async (req, res) => {
  
  try {
    if (req.user.role !== Roles.ADMIN) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isBlocked: true
      },
      orderBy: { id: "desc" }
    });
    res.status(200).json(users);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.getUserById = async (req, res) => {
  try {
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
    res.status(200).json(user);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.changeStatus = async (req, res) => {
  try {
    const { ids, isBlocked } = req.body;

    if (!ids || ids.length === 0)
      return res.status(400).json({ message: "No users selected" });

    await prisma.user.updateMany({
      where: {
        id: { in: ids.map((id) => Number(id)) },
      },
      data: { isBlocked },
    });

    res.status(200).json({
      message: `Status updated to ${isBlocked ? "block" : "active"}`,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.changeRole = async (req, res) => {
  try {
    const { ids, role } = req.body;

    await prisma.user.updateMany({
      where: { id: { in: ids.map((id) => Number(id)) } },
      data: { role },
    });

    res.status(200).json({ message: `Role changed to ${role}` });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.delete = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || ids.length === 0) return res.status(400).json({ message: "No users selected" });

    await prisma.user.deleteMany({
      where: {
        id: { in: ids.map((id) => Number(id)) },
      },
    });
    res.status(200).json({ message: "Users deleted" });
  } catch (error) {
    errorHandler(res, error);
  }
};
