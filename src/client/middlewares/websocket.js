import WS from 'ws';
import {
  clientConnect,
  clientDisconnect,
  CONNECT_SOCKET,
} from '../actions';
import config from '../config';

class Client {
  constructor(store) {
    this.queue = [];
    this.store = store;
    this.connect();
  }

  connect() {
    const socket = this.socket = new WS(config.ws.url);
    socket.onmessage = this._read.bind(this);
    socket.onopen = this._drain.bind(this);
    socket.onclose = this._close.bind(this);
  }

  send(action) {
    const message = JSON.stringify(action);
    if (!this.socket || this.socket.readyState !== 1) {
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
    this.store.dispatch(clientConnect());
    for (const message of this.queue) {
      this.socket.send(message);
    }
    this.queue = [];
  }

  _close() {
    this.store.dispatch(clientDisconnect());
    setTimeout(this.connect.bind(this), 1000);
  }
}

let client;

export default store => next => action => {
  if (client && action.meta && action.meta.pending) {
    return client.send(action);
  }
  if (action.type === CONNECT_SOCKET && !client) {
    client = new Client(store);
  }
  return next(action);
};
