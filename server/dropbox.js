const { Dropbox } = require('dropbox');

const dbx = new Dropbox({
  accessToken: process.env.DROPBOX_TOKEN
});

module.exports = dbx;