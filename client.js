import WS from 'ws';

const client = new WS('ws://localhost:3000');
let id, clients = [];

function send(message) {
  client.send(JSON.stringify(message));
}

client.onopen = () => {
  send({
    type: 'HELLO',
  });
};

client.onmessage = event => {
  const message = JSON.parse(event.data);
  switch(message.type) {
    case 'HELLO':
    id = message.id;
    break;
    case 'CLIENT_LIST':
    clients = message.clients;
  }
  render();
}

function render() {
  document.body.innerHTML = 'You are client #' + id + ', clients connected: ' + clients.join(', ');
}
