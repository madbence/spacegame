import uuid from 'uuid';

import {
  SYNC_GAME,
} from '../../common/actions';

class Client {
  constructor(socket) {
    this.socket = socket;
    this.id = uuid.v4();
    this.listeners = [];

    console.log('Client %s created!', this.id);

    this.socket.on('message', message => {
      const action = JSON.parse(message);
      for (const listener of this.listeners) {
        listener(action);
      }
    });

    this.socket.on('close', () => clients.delete(this));
    this.socket.on('close', () => console.log('Client %s destroyed!', this.id));
  }

  async send(message) {
    if (!this.ready) {
      throw new Error('Client not ready!');
    }
    const socket = this.socket;
    return await new Promise((resolve, reject) => {
      socket.send(message, null, err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  dispatch(type, payload, meta) {
    const message = JSON.stringify({
      type, payload, meta
    });

    return this.send(message);
  }

  get ready() {
    return this.socket && this.socket.readyState === 1;
  }

  subscribe(handler) {
    const listeners = this.listeners;
    listeners.push(handler);
    return function unsubscribe() {
      listeners.splice(listeners.indexOf(handler), 1);
    };
  }

  join(game) {
    game.join(this);
    const unsubscribe = game.subscribe((action, game) => {
      this.dispatch(action.type, action.payload).catch(err => {
        if (err) {
          console.log(err.stack);
        }
      });
    });
    this.socket.on('close', unsubscribe);
    this.dispatch(SYNC_GAME, game.state);
  }
}

const clients = new Set();

export function create(socket) {
  return new Client(socket);
}
