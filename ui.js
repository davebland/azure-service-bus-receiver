const express = require('express');
const readline = require('readline');
const TailingReadableStream = require('tailing-stream');

const server = express();
server.set('view engine', 'pug');
server.use(express.static('static'));

const expressWs = require('express-ws')(server);

const subscriptionsToProcess = require('./subscriptions.json');
const queuesToProcess = require('./queues.json');

server.get('/', (req, res) => {
  res.render('index', { subscriptions: subscriptionsToProcess, queues: queuesToProcess })
});

// Websocket streams
server.ws('/streams/:subscription', function(ws, req) {
  sub = req.params.subscription;
  ws.send(`Stream for ${sub}`);

  const readStream = TailingReadableStream.createReadStream(`${__dirname}/buffers/${sub}.json`, {timeout: 0});
  const readInterface = readline.createInterface({input: readStream});

  readInterface.on('line', function(data) {
    ws.send(data);
  });

  readInterface.on('error', function(err) {
    console.log('UI file read error: ', err)
  });

});

server.listen(3000, () => {
  console.log(`UI listening on port 3000.`)
});

module.exports = { server };
