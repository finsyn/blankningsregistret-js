const { } = require('ramda');

const getEntries = pipeP(
  fetchFile,
  parseEntries
);

module.exports = getEntries;
