const { pipeP } = require('ramda');
const { br_url } = require('./config.json');
const { timeFilter, fetchFileP, getFileUrlP, readXml, parseEntries } = require('./fetch.js');

const defaultFrom = new Date() - (1000*60*60*24*30);
const defaultTo = new Date();

const getEntries = ({ from=defaultFrom, to=defaultTo } = {}) => pipeP(
  getFileUrlP,
  fetchFileP,
  readXml,
  parseEntries,
  timeFilter('taken_date', from, to)
)(br_url);

module.exports = getEntries;
