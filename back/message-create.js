import { TopicMessageSubmitTransaction } from '@hashgraph/sdk';

import { topicGet } from './topic-get.js';

import { skillPublish } from '../util/skill-publish.js';

async function messageCreate(msgObject, topicIdReq) {
  const topicId = topicIdReq || (await topicGet()).topicId;
  if (!topicId) {
    console.error('No topic ID');
    return null;
  }

  const result = await skillPublish(
    topicId,
    msgObject.accountId,
    msgObject.userName,
    msgObject.skillName,
  );

  return result;
}

export {
  messageCreate,
};
