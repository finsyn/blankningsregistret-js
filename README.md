## Blankningsregistret-js

>FI will on a daily basis, normally shortly after 15:30, publish significant net short positions in shares in the document below.
[source](http://www.fi.se/en/our-registers/short-selling/)

This npm package for NodeJS fetches published net short positions from FI and outputs the result as a JS array.

## Installation

```
npm install blankningsregistret --save
```

## Usage

```javascript
const br = require('blankningsregistret');

// get positions published within the last 30 days
const entries = br();

// get positions published within a custom timespan
const thatMonthEntries = br({
  from: new Date('2017-01-01'),
  to: new Date('2017-02-01')
});

```
