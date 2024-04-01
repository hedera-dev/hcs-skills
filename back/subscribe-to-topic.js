const {
  TopicMessageQuery,
} = require('@hashgraph/sdk');

const { topicGet } = require('./topic-get.js');
const { skillSubscribe } = require('../back/skill-subscribe.js');

// key: topicId
// value: TopicMessageQuery (subscription)
const subscriptions = new Map();

async function getSubscription(topicId, wsServer) {
  const topicIdStr = topicId.toString();

  // Re-use existing TopicMessageQuery subscription if present.
  // Otherwise initialise a new one
  let subscription = subscriptions.get(topicIdStr);
  if (!subscription) {
    const socketId = `hcs-skill-${topicIdStr}`;
    console.log(`Initialising new TopicMessageQuery subscription for ${topicId} relayed on socket ID ${socketId}`);

    try {
      subscription = await skillSubscribe(topicIdStr, function(err, obj) {
        if (err) {
          console.error('Verification errors');
          console.log(err, obj);
          return;
        }
        wsServer.emit(socketId, JSON.stringify(obj));
      });
      subscriptions.set(topicIdStr, subscription);
      console.log('SUCCESS: TopicMessageQuery()', topicIdStr, socketId);
    } catch (error) {
      console.log('ERROR: TopicMessageQuery()', error);
      throw error;
    }
  }

  return subscription;
}

async function subscribeToTopic(wsServer, topicIdReq) {
  const topicId = topicIdReq || (await topicGet()).topicId;
  getSubscription(topicId, wsServer);
}

module.exports = {
  subscribeToTopic,
};
