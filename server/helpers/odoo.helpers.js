const prisma = require('../prisma');

async function getNumericStats(inventoryId) {
  return prisma.item.aggregate({
    where: { inventoryId },
    _count: { id: true },
    _avg: { integer_1: true, integer_2: true, integer_3: true },
    _min: { integer_1: true, integer_2: true, integer_3: true },
    _max: { integer_1: true, integer_2: true, integer_3: true },
  });
}

function getNumberFields(inventory, stats) {
  const fields = [];

  for (let i = 1; i <= 3; i++) {
    const label = inventory[`int${i}_label`];
    if (!label) continue;

    fields.push({
      label,
      type: "number",
      avg: stats._avg[`integer_${i}`],
      min: stats._min[`integer_${i}`],
      max: stats._max[`integer_${i}`]
    });
  }

  return fields;
}

async function getStringFields(inventory, inventoryId) {
  const queries = [];

  for (let i = 1; i <= 3; i++) {
    const label = inventory[`str${i}_label`];
    if (!label) continue;

    const fieldName = `string_${i}`;

    queries.push(
      prisma.item.groupBy({
        by: [fieldName],
        where: {
          inventoryId,
          NOT: { [fieldName]: null }
        },
        _count: { [fieldName]: true },
        orderBy: { _count: { [fieldName]: 'desc' } },
        take: 3,
      }).then(popular => ({
        label,
        type: "string",
        popular: popular.map(p => p[fieldName])
      }))
    );
  }

  return Promise.all(queries);
}

module.exports = {
  getNumericStats,
  getNumberFields,
  getStringFields
};
