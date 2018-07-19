const WebSocket = require('ws');


const wss = new WebSocket.Server({ port: 9999 });

wss.on('connection', function connection(ws) {
  ws.send('Welcome!');
  ws.on('message', function incoming(message) {
      console.log('received: %s', message);
      ws.send('Your message: ' + message);
  });

});