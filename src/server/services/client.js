import uuid from 'uuid';
import { create as createGame } from './game';

import {
  syncGame,
  JOIN_GAME,
} from '../../shared/actions';

import {
  clientInit,
} from '../../shared/actions';

class Client {
  constructor(socket) {
    this.socket = socket;
    this.id = uuid.v4();
    this.listeners = [];

    console.log('Client %s created!', this.id);

    this.socket.on('message', message => {
      const action = JSON.parse(message);
      action.meta.client = this.id;
      if (!this.game && action.type === JOIN_GAME) {
        this.join(createGame(), action.payload.name);
      }
      for (const listener of this.listeners) {
        listener(action);
      }
    });

    this.socket.on('close', () => console.log('Client %s destroyed!', this.id));

    this.dispatch(clientInit(this.id));
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

  dispatch(action) {
    return this.send(JSON.stringify(action));
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

  join(game, name) {
    game.join(this, name);
    const unsubscribe = game.subscribe(action => {
      action.meta.pending = false;
      this.dispatch(action).catch(err => {
        if (err) {
          console.log(err.stack);
        }
      });
    });
    this.socket.on('close', unsubscribe);
    this.dispatch(syncGame(game.state));
    this.game = game;
  }

  toJSON() {
    return {
      id: this.id,
    };
  }
}

const clients = [];

export function create(socket) {
  const client = new Client(socket);
  client.socket.on('close', () => clients.splice(clients.indexOf(client), 1));
  clients.push(client);
  return client;
}

export function list() {
  return clients;
}
