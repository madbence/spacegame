import game from '../common/game';

let state, initial;

state = initial = {
  messages: [],
  ships: [{
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    orientation: Math.PI / 2,
    rotation: 0,
    thrusters: [{
      position: { x: 0, y: -10 },
      orientation: 0,
      strength: 0,
    }, {
      position: { x: 5, y: 8 },
      orientation: Math.PI / 2,
      strength: 0
    }, {
      position: { x: -5, y: 8 },
      orientation: -Math.PI / 2,
      strength: 0
    }],
  }],
};

// generate user id from uid
let uid = 0;
const clients = new Set();

/**
 * Broadcast action to everyone
 * @param {string} type
 * @param {Object} payload
 * @param {Object} meta Related meta-info about the action
 */
function broadcast(type, payload, meta) {
  // serialize the message
  const message = JSON.stringify({
    type,
    payload,
    meta,
  });

  // send the serialized message to every client
  [...clients].forEach(client => {
    if (client.readyState !== 1) {
      console.log(`Client has readyState ${client.readyState}, not sending message`);
      return;
    }
    client.send(message, null, err => {
      if (err) {
        console.error(err.stack);
      }
    });
  });
}

setInterval(() => {
  state.ships = game(state.ships, {
    type: 'TICK',
  });
  broadcast('TICK', undefined, {
    done: true,
  });
}, 1000 / 60);

setInterval(() => {
  broadcast('SYNC_STATE', state, {
    done: true,
  });
}, 10000);

export default client => {
  // assign uniq id to client
  client.id = uid++;

  // broadcast that a new user connected
  broadcast('ADD_USER', {
    id: client.id,
  });

  // actually add new client to clients
  clients.add(client);

  client
    // client sent a message to the server
    .on('message', message => {

      // parse message
      const action = JSON.parse(message);

      switch (action.type) {
        case 'ADD_MESSAGE':

        // "simulate" server delay (like it's doing some serious work)
        setTimeout(() => {

          // broadcast the received message to every other user
          broadcast('ADD_MESSAGE', {
            message: action.payload.message,
            author: client.id,
            date: new Date(),
          }, {
            done: true,
            id: action.meta.id,
          });
        }, 1000); break;

        default:
        // console.log(JSON.stringify(action));
        state = {
          ships: game(state.ships, action),
          messages: state.messages,
        };
        broadcast(action.type, action.payload, {
          done: true,
        }); break;
      }
    })

    // client left
    .on('close', () => {

      // remove from active clients
      clients.delete(client);

      // reset state when server is empty
      if (clients.size == 0) {
        state = initial;
      }

      // broadcast to everyone that client left
      broadcast('DEL_USER', {
        id: client.id,
      });
    });
}
