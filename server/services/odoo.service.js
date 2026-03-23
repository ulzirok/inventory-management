const prisma = require("../prisma");
const createError = require("../utils/createError");
const {
  getNumericStats,
  getNumberFields,
  getStringFields
} = require('../helpers/odoo.helpers');

module.exports.getInventoryStats = async (req) => {
  const apiToken = req.headers.authorization?.replace('Bearer ', '');
  if (!apiToken) throw createError("API token not provided", 401);

  const inventory = await prisma.inventory.findUnique({
    where: { apiToken }
  });
  if (!inventory) throw createError("Invalid API token", 403);

  const numericStats = await getNumericStats(inventory.id);
  const numberFields = getNumberFields(inventory, numericStats);
  const stringFields = await getStringFields(inventory, inventory.id);

  return {
    title: inventory.title,
    totalItems: numericStats._count.id,
    fields: [...numberFields, ...stringFields]
  };
};