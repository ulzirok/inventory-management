const axios = require('axios');
const jsforce = require('jsforce');
const createError = require("../utils/createError");

const getAccessToken = async () => {
  const params = new URLSearchParams();

  params.append('grant_type', 'client_credentials');
  params.append('client_id', process.env.SF_CLIENT_ID);
  params.append('client_secret', process.env.SF_CLIENT_SECRET);

  const response = await axios.post(
    process.env.SF_TOKEN_URL,
    params
  );

  return response.data;
};

const getConnection = async () => {
  const { access_token, instance_url } = await getAccessToken();

  return new jsforce.Connection({
    instanceUrl: instance_url,
    accessToken: access_token
  });
};

const createAccount = async (connection, companyName) => {
  try {
    const account = await connection.sobject("Account").create({
      Name: companyName
    });
    if (!account.success) {
      throw new Error(account.errors.map(e => e.message).join(', '));
    }
    
    return account;
  } catch (err) {
    throw createError(`Salesforce Account Error: ${err.message}`, 502);
  }
};

const createContact = async (connection, accountId, lastName, email) => {
  try {
    const contact = await connection.sobject("Contact").create({
      LastName: lastName,
      Email: email,
      AccountId: accountId,
    });
    if (!contact.success) throw new Error("Contact creation failed");
    
    return contact;
  } catch (err) {
    throw createError(`Salesforce Contact Error: ${err.message}`, 502);
  }
};

const deleteContactsFromSF = async (sfIds) => {
  if (!sfIds.length) return;

  try {
    const connection = await getConnection();
    const results = await connection.sobject("Contact").del(sfIds);

    results.forEach((res, index) => {
      if (!res.success) {
        console.error(`Failed to delete Salesforce Contact ${sfIds[index]}:`, res.errors);
      }
    });

    console.log(`Deleted ${sfIds.length} contacts from Salesforce`);
  } catch (err) {
    console.error("Salesforce delete error:", err.message);
  }
};

module.exports = {
  getAccessToken,
  getConnection,
  createAccount,
  createContact,
  deleteContactsFromSF
};