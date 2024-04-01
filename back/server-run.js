const {
  httpServer,
  wsServer,
} = require('./server.js');

const portNumber = 3113;

httpServer.listen(portNumber, () => {
  console.log(`Listening on port ${portNumber}`);
});

wsServer.attach(httpServer);
