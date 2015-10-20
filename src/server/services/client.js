import uuid from 'uuid';

class Client {
  constructor(socket) {
    this.socket = socket;
    this.id = uuid.v4();
    this.listeners = [];

    this.socket.on('message', message => {
      const action = JSON.parse(message);
      for (const listener of this.listeners) {
        listener(action);
      }
    });
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
}

const clients = new Set();

export function create(socket) {
  return new Client(socket);
}
