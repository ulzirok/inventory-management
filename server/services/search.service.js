const prisma = require("../prisma");

module.exports.search = async (query) => {
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

  return searchResult;
};