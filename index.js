const { } = require('ramda');
const { br_url } = require('./config.json');
const fetchFileP = require('./fetch.js');

const getEntries = pipeP(
  fetchFileP,
  parseEntries
);

module.exports = getEntries;

 
