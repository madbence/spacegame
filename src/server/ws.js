import game from '../common/game';
import { create as createGame } from './services/game';

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

export default client => {
  // assign uniq id to client
  client.id = uid++;

  const game = createGame();

  const unsubscribe = game.subscribe((action, game) => {
    const message = JSON.stringify({
      type: action.type,
      payload: action.payload,
      meta: {
        done: true,
      },
    });

    client.send(message, null, err => {
      if (err) {
        console.log(err.stack);
      }
    });
  });

  game.start();

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
        game.step(action);
      }
    })

    // client left
    .on('close', () => {

      // remove from active clients
      clients.delete(client);
      unsubscribe();

      // broadcast to everyone that client left
      broadcast('DEL_USER', {
        id: client.id,
      });
    });
}
