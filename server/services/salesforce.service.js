const prisma = require("../prisma.js");
const { checkNotSyncedSF } = require('../helpers/users.helpers');
const {
  getConnection,
  createAccount,
  createContact
} = require('../helpers/salesforce.helpers');

module.exports.syncToSalesforce = async (req) => {
  const { companyName, name, email } = req.body;
  const userId = req.user?.id;
  
  await checkNotSyncedSF(userId);
  const connection = await getConnection()
  const account = await createAccount(connection, companyName);
  const contact = await createContact(connection, account.id, name, email);
  
  await prisma.user.update({
    where: { id: userId },
    data: { salesforceId: contact.id }
  });

  return {
    success: true,
    message: 'Synchronized with Salesforce successfully.',
    sfId: contact.id
  };
};