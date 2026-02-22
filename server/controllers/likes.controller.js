const prisma = require('../prisma.js');
const errorHandler = require('../utils/errorHandler.js');

module.exports.like = async (req, res) => {
    const { itemId } = req.params;
    try {
        await prisma.like.create({
            data: {
                itemId,
                userId: req.user.id
            }
        })
        res.status(201).json({ message: 'Liked successfully'})
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'You already liked this item.' });
        }
        errorHandler(res, error)
    }
}