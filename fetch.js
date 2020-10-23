const https = require('https');
const { joinP, pOf } = require('./ramdap');
const fs = require('fs');
const XLSX = require('xlsx');
const scrapeIt = require('scrape-it');
const { zipWith, call, zipObj, __, map, allPass, lt, lte, gte,
        filter, gt, length, groupWith, equals, tail, keys, values,
        curry, head, curryN, join, converge, always, concat, constructN,
        pipeP, invoker, tap, pipe, prop, identity, path, ifElse, is,
        replace, toUpper } = require('ramda');
const { parse } = require('url');

function getFileUrlP ({ url, historical = false }) {
  // naive, FI puts historical position link below active positions link
  const fileUrl = historical ? `${url}/GetHistFile/` : `${url}/GetAktuellFile/`
  return Promise.resolve(fileUrl)
}

function fetchFileP (url) {

  const getP = (url, resolve, reject) => {
    https.get(url, resolve, reject);
  };

  return new Promise(curry(getP)(url)); 
}

function readXml (readableStream) {

  const readStream = (stream, resolve, reject) => {
    let buffers = [];
    stream.on('data', function(data) { buffers.push(data); });
    stream.on('end', function() {
      let buffer = Buffer.concat(buffers);
      let workbook = XLSX.read(buffer, {type:'buffer'});
      resolve(workbook);
    });
  };

  return new Promise(curry(readStream)(readableStream));
}

function timeFilter (field, from, to) {

  const isWithinRange = pipe(
    prop(field),
    allPass(
      [
        lte(from),
        gte(to)
      ]
    )
  );

  return filter(isWithinRange);
}

const getSheetName = pipe(
  prop('SheetNames'),
  head
);

const getSheets = prop('Sheets');

const getSheet = converge(
  prop,
  [
    getSheetName,
    getSheets
  ]
);

const isSameRow = (idx1, idx2) => tail(idx1) === tail(idx2);

const getEntriesIdx = pipe(
  keys,
  groupWith(isSameRow),
  filter(pipe(length, lt(4))), // > 5 column rows are considered as entries ...
  tail                         // ... except the first description one
);

const getVals = (ws, idxGroups) => map(
  map(prop(__, ws))
)(idxGroups);

const dateConstruct = constructN(1, Date);

const parsePercent = ifElse(
  is(String),
  pipe(
    replace(/<0\,5/g, '0.0'),
    constructN(1, Number)
  ),
  identity
)

const toEntry = pipe(
  zipWith(
    call,
    [
      // recently FI seems to store all names in uppercase
      // so keep it like this for everyone to make them comparable
      // with old values
      pipe(prop('v'), toUpper),
      prop('v'),
      prop('v'),
      pipe(prop('v'), parsePercent),
      pipe(prop('w'), dateConstruct)
    ]
  ),
  zipObj(
    [
      'position_holder_name',
      'issuer_name',
      'isin',
      'percent',
      'taken_date'
    ]
  )
)

const getEntries = pipe(
  getSheet,
  converge(
    getVals,
    [
      identity,
      getEntriesIdx
    ]
  ),
  map(toEntry)
);

// https://github.com/SheetJS/js-xlsx#working-with-the-workbook
const parseEntries = getEntries

module.exports = {
  getFileUrlP,
  fetchFileP,
  readXml,
  parseEntries,
  timeFilter
};
