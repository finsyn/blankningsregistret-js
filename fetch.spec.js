const t = require('tap');
const fs = require('fs');
const { readXml, getFileUrlP, fetchFileP, parseEntries } = require('./fetch');
const pageUrl = 'http://www.fi.se/sv/vara-register/blankning/';
const fileUrl = 'http://www.fi.se/contentassets/71a61417bb4c49c0a4a3a2582ea8af6c/korta_positioner_2017-07-14.xlsx';

// t.test('get file url', t => {
//   return getFileUrlP(pageUrl)
//     .then(result => {
//       console.log(result);
//       t.end();
//     })
// })
// .catch(t.threw);

t.test('parse entries', t => {
  let readStream = fs.createReadStream('mock.xlsx');
  let workbookP = readXml(readStream); 

  return workbookP
    .then(workbook => {
      const entries = parseEntries(workbook);
      console.log(entries);
      t.end();
    });
});
// t.test('fetch file from site', t => {
//   return fetchFileP(fileUrl)
//     .then(result => {
//       console.log(result);
//       t.end();
//     })
// })
// .catch(t.threw);
