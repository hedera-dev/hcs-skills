const socket = io('/');

socket.on('connect', function() {
  console.log('Connected to the web sockets server');
});

socket.on('hcs-skill', function(msg) {
  console.log('Received HCS Skill:', msg);
  addMessage(JSON.parse(msg));
});

const data = {
  type: 'hcs-skill/v1',
  topicId: '',
};

document.addEventListener('DOMContentLoaded', async (event) => {
  const response = await fetch(
    '/api/v1/topic/create',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    const message = `An error occurred: ${response.statusText}`;
    throw new Error(message);
  }

  const result = await response.json();
  data.topicId = result.topicId;
  displayTopicId();
});

function displayTopicId() {
  const newTopicId = document.getElementById('newTopicId');
  newTopicId.innerHTML = `<b>Topic ID: ${data.topicId}</b>`;
}

async function submitToHedera() {
  const textInputSkill = document.getElementById('textInputSkill').value;
  const textInputUsername = document.getElementById('textInputUsername').value;
  const textInputAccountId = document.getElementById('textInputAccountId').value;
  if (!textInputSkill || !textInputUsername || !textInputAccountId) {
    alert('Please enter some text to submit.');
    return;
  }

  // Send message to server to send to Hedera
  const response = await fetch(
    '/api/v1/message/create',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: data.type,
        accountId: textInputAccountId,
        skillName: textInputSkill,
        userName: textInputUsername,
      }),
    },
  );

  if (!response.ok) {
    const message = `An error occurred: ${response.statusText}`;
    throw new Error(message);
  }

  const result = await response.json(); // Assuming the server responds with JSON
  document.getElementById('textInputSkill').value = ''; // Clear the input field
  document.getElementById('textInputUsername').value = ''; // Clear the input field
  document.getElementById('textInputAccountId').value = ''; // Clear the input field
}

function addMessage(message) {
  const tableBody = document
    .getElementById('messagesTable')
    .getElementsByTagName('tbody')[0];

  const newRow = tableBody.insertRow();

  // Creating a new cell for each piece of information and appending it
  const skillNameCell = newRow.insertCell(0);
  const skillNameText = document.createTextNode(message.skillName);
  skillNameCell.appendChild(skillNameText);

  const userNameCell = newRow.insertCell(1);
  const userNameText = document.createTextNode(message.userName);
  userNameCell.appendChild(userNameText);

  const accountIdCell = newRow.insertCell(2);
  const accountIdText = document.createTextNode(message.accountId);
  accountIdCell.appendChild(accountIdText);

  const typeCell = newRow.insertCell(3);
  const typeText = document.createTextNode(message.type);
  typeCell.appendChild(typeText);

  const hashCell = newRow.insertCell(4);
  hashCell.title = message.hash;
  const hashText = document.createTextNode(`${message.hash.substr(0, 6)}…`);
  hashCell.appendChild(hashText);
}
