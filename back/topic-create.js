import { TopicCreateTransaction } from '@hashgraph/sdk';

import { topicGet } from './topic-get.js';
import { create } from './topic-persist.js';

import { client, operatorId } from '../util/sdk-client.js';

async function topicCreateRaw() {
  // register a new Topic in HCS
  let txResponse = await new TopicCreateTransaction().execute(client);
  let receipt = await txResponse.getReceipt(client);
  let topicId = receipt.topicId;
  create(topicId);
  return {
    operatorId: operatorId.toString(),
    topicId,
  };
}

async function topicCreate() {
  let { topicId } = await topicGet();
  const usedCache = !!topicId;
  if (!usedCache) {
    // delay returning the topic ID by several seconds
    // to give it time to propagate before it gets used in queries or subscribed to
    await new Promise((resolve) => setTimeout(resolve, 5000));
    topicId = (await topicCreateRaw()).topicId.toString();
  }
  return {
    operatorId: operatorId.toString(),
    topicId,
    usedCache,
  };
}

export {
  topicCreateRaw,
  topicCreate,
};
