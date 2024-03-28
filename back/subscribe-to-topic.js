const { topicGet } = require("./topic-get.js");
const { skillVerify } = require("../util/skill-verify.js");

const {
  TopicMessageQuery,
} = require('@hashgraph/sdk');

const {
  client,
} = require('../util/sdk-client.js');
const { addHash } = require("../util/objects.js");

async function subscribeToTopic(io) {
  let { topicId } = await topicGet();

  // delay the subscription (tiemout) 5s
  await new Promise((resolve) => setTimeout(resolve, 5000));

  try {
    new TopicMessageQuery().setTopicId(topicId).subscribe(
      client,
      (message) => {
        const mirrorMessage = new TextDecoder("utf-8").decode(message.contents);
        const messageJson = JSON.parse(mirrorMessage);
        const messageWithHash = addHash(messageJson);

        // Verify if the received message is valid
        const verificationErrors = skillVerify(messageWithHash);
        if (verificationErrors && verificationErrors.length > 0) {
          console.error("Verification errors:", verificationErrors);
          return;
        }

        io.emit("chat-message", JSON.stringify(messageWithHash));
      }
    );
    console.log("MirrorConsensusTopicQuery()", topicId.toString());
  } catch (error) {
    console.log("ERROR: MirrorConsensusTopicQuery()", error);
    process.exit(1);
  }
}

module.exports = {
  subscribeToTopic,
};