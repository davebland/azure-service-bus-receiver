const express = require('express');

const ws = express();
ws.set('view engine', 'pug');
ws.use(express.static('static'));

const subscriptionsToProcess = require('./subscriptions.json');

ws.get('/', (req, res) => {
  res.render('index', { subscriptions: subscriptionsToProcess })
});

ws.listen(3000, () => {
  console.log(`UI listening on port 3000.`)
});

module.exports = { ws };