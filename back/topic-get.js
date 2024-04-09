import { read } from './topic-persist.js';

async function topicGet() {
  const topicId = await read();
  const topicIdString = (!!topicId) ?
    topicId.toString() :
    null;
  return {
    topicId: topicIdString,
  };
}

export {
  topicGet,
};
