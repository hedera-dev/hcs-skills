const {
  TopicId,
  TopicMessageQuery,
} = require('@hashgraph/sdk');


const { client } = require('./sdk-client.js');
const { deserialise } = require('./objects.js');
const { skillVerify } = require('./skill-verify.js');

function parseSkill(msgBin, format, callback) {
  const msgStr = Buffer.from(msgBin, format).toString();
  const obj = deserialise(msgStr);
  const validationErrors = skillVerify(obj);
  if (validationErrors) {
    callback(validationErrors, obj);
  } else {
    callback(undefined, obj);
  }
}

// list all skills previously added to the topic
async function skillGetAll(topicId, callback) {
  if (typeof topicId === 'string') {
    topicId = TopicId.fromString(topicId);
  }

  // NOTE: Mirror Node query of HCS topic
  // Step (10) in the accompanying tutorial
  // const mirrorNodeUrl =
  //   `https://testnet.mirrornode.hedera.com/api/v1/topics/${/* ... */}/messages`;
  // const fetchResponse = /* ... */;
  const mirrorNodeUrl =
    `https://testnet.mirrornode.hedera.com/api/v1/topics/${topicId.toString()}/messages`;
  const fetchResponse = await fetch(mirrorNodeUrl);
  const response = await fetchResponse.json();
  response.messages.forEach((msgBin) => parseSkill(msgBin.message, 'base64', callback));

  // Note that there is no subscription object to return, as this is a single request
}

// listen for new skills being added to the topic
async function skillSubscribe(topicId, callback) {
  if (typeof topicId === 'string') {
    topicId = TopicId.fromString(topicId);
  }

  // NOTE: Subscribe to HCS topic
  // Step (11) in the accompanying tutorial
  // const subscription = new TopicMessageQuery()
  //   /* ... */
  //   .subscribe(client, (msgBin) => parseSkill(msgBin.contents, 'utf8', callback));
  const subscription = new TopicMessageQuery()
    .setTopicId(topicId)
    .subscribe(client, (msgBin) => parseSkill(msgBin.contents, 'utf8', callback));

  return subscription;
}

module.exports = {
  skillGetAll,
  skillSubscribe,
};
