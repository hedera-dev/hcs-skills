const {
  httpServer,
  wsServer,
} = require('./server.js');

httpServer.listen(3113, () => {
  console.log('Listening on port 3113');
});

wsServer.attach(httpServer);
