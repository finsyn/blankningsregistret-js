const { pipe, juxt, tap } = require('ramda');

const ofP = a => Promise.all(a);

const joinP = arrayP => pipe(
  juxt(arrayP),
  ofP
);

const pOf = res => Promise.resolve(res);

module.exports = {
  joinP,
  ofP,
  pOf
};
