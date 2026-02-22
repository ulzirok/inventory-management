const prisma = require("../prisma");
const errorHandler = require("../utils/errorHandler");

module.exports.getByItem = async (req, res) => {
    const { itemId } = req.params;
    try {
        const comments = await prisma.comment.findMany({
            where: { itemId },
            include: { author: { select: { name: true } } },
            orderBy: { createdAt: "asc" },
        });
        res.status(200).json(comments);
    } catch (error) {
        errorHandler(res, error);
    }
};

module.exports.create = async (req, res) => {
    const { itemId, text } = req.body;
    try {
        const comment = await prisma.comment.create({
            data: {
                text,
                itemId,
                authorId: req.user.id,
            },
            include: { author: { select: { name: true } } },
        });
        res.status(201).json(comment);
    } catch (error) {
        errorHandler(res, error);
    }
};
