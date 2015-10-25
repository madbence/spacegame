import WS from 'ws';

class Client {
  constructor(store) {
    this.queue = [];
    this.store = store;
    this.connect();
  }

  connect() {
    const socket = this.socket = new WS('ws://localhost:3000');
    socket.onmessage = this._read.bind(this);
    socket.onopen = this._drain.bind(this);
    socket.onclose = this._close.bind(this);
  }

  send(action) {
    const message = JSON.stringify(action);
    if (!this.socket || this.socket.readyState != 1) {
      this.queue.push(message);
      return;
    }
    this.socket.send(message);
  }

  _read(event) {
    const action = JSON.parse(event.data);
    this.store.dispatch(action);
  }

  _drain() {
    for (const message of this.queue) {
      this.socket.send(message);
    }
    this.queue = [];
  }

  _close() {
    setTimeout(this.connect.bind(this), 1000);
  }
}

let client;

export default store => next => action => {
  if (action.meta && action.meta.pending) {
    if (!client) {
      client = new Client(store);
    }
    return client.send(action);
  }
  return next(action);
};
