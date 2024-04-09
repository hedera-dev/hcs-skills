import {
  TopicId,
  TopicMessageSubmitTransaction,
} from '@hashgraph/sdk';

import { client } from './sdk-client.js';
import { skillVerify } from './skill-verify.js';
import {
  addHash,
  serialise,
} from './objects.js';

async function skillPublish(topicId, accountId, userName, skillName) {
  if (typeof topicId === 'string') {
    topicId = TopicId.fromString(topicId);
  }

  const skillData = {
    type: 'hcs-skill/v1',
    accountId,
    userName,
    skillName,
  };

  // NOTE: Add hash to message
  // Step (7) in the accompanying tutorial
  // const obj = /* ... */;
  const obj = addHash(skillData);

  // NOTE: Verify message
  // Step (8) in the accompanying tutorial
  // const validationErrors = /* ... */;
  const validationErrors = skillVerify(obj);
  if (validationErrors) {
    console.error(validationErrors);
    throw new Error('skill validation failed');
  }

  // NOTE: Submit message to HCS topic
  // Step (9) in the accompanying tutorial
  const hcsMsg = serialise(obj);
  // const topicMsgSubmitTx = await new TopicMessageSubmitTransaction(/* ... */).execute(client);
  const topicMsgSubmitTx = await new TopicMessageSubmitTransaction({
    topicId: topicId,
    message: hcsMsg,
  }).execute(client);

  const topicMsgSubmitReceipt = await topicMsgSubmitTx.getReceipt(client);

  return {
    status: topicMsgSubmitReceipt.status,
    seqNum: topicMsgSubmitReceipt.topicSequenceNumber,
    operatorId: topicMsgSubmitReceipt.operatorId,
    skillData,
    hash: obj.hash,
  };
}

export {
  skillPublish,
};
