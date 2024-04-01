const {
  TopicMessageQuery,
} = require('@hashgraph/sdk');

const { topicGet } = require('./topic-get.js');
const { client } = require('../util/sdk-client.js');
const { addHash } = require('../util/objects.js');
const { skillVerify } = require('../util/skill-verify.js');

const subscriptions = new Map(); // key: topicId, value: TopicMessageQuery

async function getSubscription(topicId, wsServer) {
  const topicIdStr = topicId.toString();
  let subscription = subscriptions.get(topicIdStr);

  if (!subscription) {
    const socketId = `hcs-skill-${topicIdStr}`;
    console.log(`Initialising new TopicMessageQuery subscription for ${topicId} relayed on socket ID ${socketId}`);

    // delay the subscription (timeout) 5s
    await new Promise((resolve) => setTimeout(resolve, 5000));

    try {
      subscription = new TopicMessageQuery().setTopicId(topicId).subscribe(
        client,
        (message) => {
          const mirrorMessage = new TextDecoder('utf-8').decode(message.contents);
          const messageJson = JSON.parse(mirrorMessage);
          const messageWithHash = addHash(messageJson);

          // Verify if the received message is valid
          const verificationErrors = skillVerify(messageWithHash);
          if (verificationErrors && verificationErrors.length > 0) {
            console.error('Verification errors:', verificationErrors);
            return;
          }

          wsServer.emit(socketId, JSON.stringify(messageWithHash));
        }
      );
      subscriptions.set(topicIdStr, subscription);
      console.log('MirrorConsensusTopicQuery()', topicIdStr);
    } catch (error) {
      console.log('ERROR: MirrorConsensusTopicQuery()', error);
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
