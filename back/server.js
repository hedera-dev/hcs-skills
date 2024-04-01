const http = require('node:http');
const path = require('node:path');

const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

const { topicCreate } = require('./topic-create.js');
const { topicGet } = require('./topic-get.js');
const { subscribeToTopic } = require('./subscribe-to-topic.js');
const { messageCreate } = require('./message-create.js');

const server = express();

// Use CORS middleware for all routes
server.use(cors());

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // allows requests from any origin
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

server.use(express.urlencoded({ extended: true }));

server.use(express.json());

server.get('/api/v1/topic/create', async (req, res) => {
  try {
    const result = await topicCreate();
    await subscribeToTopic(wsServer);
    res.status(200).json(result);
  } catch (ex) {
    console.error(new Date().toISOString(), ex);
    res.status(400).send();
  }
});

server.get('/api/v1/topic/get', async (req, res) => {
  try {
    const result = await topicGet();
    res.status(200).json(result);
  } catch (ex) {
    console.error(new Date().toISOString(), ex);
    res.status(400).send();
  }
});

server.post('/api/v1/message/create', async (req, res) => {
  try {
    const result = await messageCreate(req.body);
    res.status(200).json(result);
  } catch (ex) {
    console.error(new Date().toISOString(), ex);
    res.status(400).send();
  }
});

server.use(express.static(path.resolve(__dirname, '../front')));

const httpServer = http.createServer(server);

const wsServer = new Server(
  {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  }
);

function getServers () {
  return {
    httpServer,
    wsServer,
  };
}

module.exports = {
  httpServer,
  wsServer,
  getServers,
};
