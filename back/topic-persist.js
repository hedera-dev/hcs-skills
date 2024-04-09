// TODO replace in memory persistence with files or databases
// TODO handle de/serialisation

const store = {
  topicId: undefined,
};

async function create(topicId) {
  store.topicId = topicId;
}

async function read() {
  return store.topicId;
}

export {
  create,
  read,
};
