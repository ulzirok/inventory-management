const prisma = require("../prisma");
const errorHandler = require("../utils/errorHandler");

module.exports.search = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(200).json([]);
    }

    const formattedQuery = query
      .trim()
      .split(/\s+/)
      .map(word => `${word}:*`)
      .join(' & ');

    const searchResult = await prisma.$queryRaw`
      SELECT 
        i.*, 
        u.name AS "authorName",
        (SELECT count(*)::int FROM "Item" WHERE "inventoryId" = i.id) as "itemsCount",
        ts_rank(idx.document, to_tsquery('simple', ${formattedQuery})) as rank
      FROM "Inventory" i
      JOIN "User" u ON u.id = i."authorId"
      JOIN inventory_search_v idx ON idx.inventory_id = i.id
      WHERE idx.document @@ to_tsquery('simple', ${formattedQuery})
      ORDER BY rank DESC
      LIMIT 50;
    `;

    res.status(200).json(searchResult);
  } catch (error) {
    console.error('FTS Search Error:', error);
    errorHandler(res, error);
  }
};
