import {
  TopicId,
  TopicMessageQuery,
  TopicInfoQuery,
} from '@hashgraph/sdk';


import { client } from './sdk-client.js';
import { deserialise } from './objects.js';
import { skillVerify } from './skill-verify.js';

// This function is used as a callback each time a message is received
// When messages are received, they have to be:
// - decoded from their raw format,
// - deserialised into an object, and
// - validated
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

  // Check that the topic actually exists before proceeding
  // This is done to catch when the IDs of other entity types (e.g. account) are passed in
  let topicInfo;
  try {
    topicInfo = await new TopicInfoQuery()
      .setTopicId(topicId)
      .execute(client);
  } catch (ex) {
    console.log(ex);
    throw new Error('Topic does not exist');
  }

  await new Promise((resolve) => { setTimeout(resolve, 5_000) });

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

export {
  skillGetAll,
  skillSubscribe,
};
