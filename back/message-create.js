const {
  TopicMessageSubmitTransaction,
} = require('@hashgraph/sdk');

const {
  topicGet,
} = require('./topic-get.js');

const {
  client,
  operatorId,
} = require('../util/sdk-client.js');

async function messageCreate(msgObject, topicIdReq) {
  const topicId = topicIdReq || (await topicGet()).topicId;
  if (!topicId) {
    console.error('No topic ID');
    return null;
  }

  let txResponse = await new TopicMessageSubmitTransaction()
    .setTopicId(topicId)
    .setMessage(JSON.stringify(msgObject))
    .execute(client);

  await txResponse.getReceipt(client);

  return {
    operatorId: operatorId.toString(),
    topicId,
  };
}

module.exports = {
  messageCreate,
};
