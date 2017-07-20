const { pipeP } = require('ramda');
const { br_url } = require('./config.json');
const { fetchFileP, getFileUrlP, readXml, parseEntries } = require('./fetch.js');

const getEntries = pipeP(
  getFileUrlP,
  fetchFileP,
  readXml,
  parseEntries
);

getEntries(br_url);
// module.exports = getEntries;
