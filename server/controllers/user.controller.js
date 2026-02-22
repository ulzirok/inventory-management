const prisma = require('../prisma')
const errorHandler = require('../utils/errorHandler')

module.exports.getAll = async (req, res) => {
  try {
    const users = await prisma.user.findMany()
    res.status(200).json(users)
  } catch (error) {
    errorHandler(res, error)
  }
};

module.exports.getUserById = async (req, res) => {
  const {id} = req.params
  try {
    const user = await prisma.user.findUnique({
      where: {id: Number(id)}
    })
    res.status(200).json(user)
  } catch (error) {
    errorHandler(res, error)
  }
};

module.exports.changeStatus = async (req, res) => {
  try {
    const { ids, isBlocked } = req.body; 

    if (!ids || ids.length === 0) return res.status(400).json({ message: 'No users selected' });

    await prisma.user.updateMany({
      where: {
        id: { in: ids.map(id => Number(id)) }
      },
      data: { isBlocked }
    });

    res.status(200).json({
      message: `Status successfully updated to ${isBlocked ? 'block' : 'unblock'}`
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.changeRole = async (req, res) => {
  try {
    const { ids, role } = req.body; 

    await prisma.user.updateMany({
      where: { id: { in: ids.map(id => Number(id)) } },
      data: { role }
    });

    res.status(200).json({ message: `Role changed to ${role}` });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.delete = async (req, res) => {
  const { ids } = req.body;
  try {
    if (!ids || ids.length === 0) return res.status(400).json({ message: 'No users selected' });
    
    await prisma.user.deleteMany({
      where: {
        id: { in: ids.map(id => Number(id)) }
      }
    });
    res.status(200).json({ message: 'Users successfully deleted'})
  } catch (error) {
    errorHandler(res, error)
  }
};