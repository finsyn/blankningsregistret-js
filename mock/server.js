const HOST = '127.0.0.1';

const fs = require('fs');
const url = require('url');
const http = require('http');

const serveMock = (req, res) => {
  fs.readFile(`${__dirname}/mock.html`, (err, html) => {
    err && console.error(err);
    res.writeHeader(200, {
      'content-type': 'text/html'
    });
    res.write(html);
    res.end();
  });
};

const init = (PORT) => {
  const server = http.createServer(serveMock).listen(PORT, HOST);
  console.log("Serving at http://" + HOST + ':' + PORT.toString() + '/');
  return server;
};

module.exports = init;



