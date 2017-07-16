const http = require('http');
const { joinP, pOf } = require('./ramdap');
const scrapeIt = require('scrape-it');
const { curry, join, converge, always, concat, constructN, pipeP, invoker, tap, pipe, prop } = require('ramda');
const { parse } = require('url');

function getFileUrlP (url) {

  const scrapeP = url => scrapeIt(url, {
    url: {
      selector: '.link-list ul li:nth-child(2) a',
      attr: 'href'
    }
  });

  const getUrlParts = joinP(
    [
      pipe(tap(console.log),parse, prop('protocol'), pOf),
      always('//'),
      pipe(tap(console.log),parse, prop('host'), pOf),
      pipeP(scrapeP, prop('url'))
    ]
  );

  const getUrl = pipeP(
    getUrlParts,
    join(''),
    pOf
  );

  return getUrl(url);
}

function fetchFileP (url) {

  const getP = (url, resolve, reject) => {
    http.get(url, resolve, reject);
  };

  return new Promise(curry(getP)(url)); 
}

module.exports = {
  getFileUrlP,
  fetchFileP
};
