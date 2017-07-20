const t = require('tap');
const fs = require('fs');
const mockServer = require('./mock/server');
const { readXml, getFileUrlP, fetchFileP, parseEntries } = require('./fetch');
const pageUrl = '/sv/vara-register/blankning/';
const filePath = '/contentassets/71a61417bb4c49c0a4a3a2582ea8af6c/korta_positioner_2017-07-20.xlsx';

t.test('get file url', t => { 

  const PORT = 9000;
  const url = `http://localhost:${PORT}`;
  
  const server = mockServer(PORT);  

  getFileUrlP(url)
    .then(result => {
      t.match(result, `${url}${filePath}`);
      server.close();
      t.end();
    })
});
t.end();

t.test('parse entries', t => {
  let readStream = fs.createReadStream('mock.xlsx');
  let workbookP = readXml(readStream); 

  return workbookP
    .then(workbook => {
      const entries = parseEntries(workbook);
      // only test swedish ones for now, some foreign ones have faulty input in the register
      const sweEntries = entries.filter(e => /SE[0-9]{10}/.test(e));
      sweEntries.forEach(e => {
        t.match(e, {
          published_at: Date,
          position_holder_name: /.+/,
          issuer_name: /.+/,
          isin: /[A-Z]{2,3}[0-9]{10}/,
          percent,
          taken_date: Date
        });
      });
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
