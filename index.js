const { pipeP } = require('ramda');
const { br_url } = require('./config.json');
const { timeFilter, fetchFileP, getFileUrlP, readXml, parseEntries } = require('./fetch.js');

const defaultFrom = new Date() - (1000*60*60*24*30);
const defaultTo = new Date();

const getEntriesBuilder = ({ from=defaultFrom, to=defaultTo } = {}) => pipeP(
  getFileUrlP,
  fetchFileP,
  readXml,
  parseEntries,
  timeFilter('published_at', from, to)
);

module.exports = getEntriesBuilder;
