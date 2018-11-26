const run = require('./index')

run({ historical: true })
  .then(console.log)
  .catch(console.error)
