// @flow

import Server from './server';
import type {Action} from './actions';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

type Channel = (action: Action) => void;

export default class ServerProxy {
  delay: number;
  server: Server;

  constructor(delay: number, server: Server) {
    this.delay = delay;
    this.server = server;
  }

  async join(name: string, channel: Channel): Promise<number> {
    await sleep(this.delay);
    return this.server.join(name, channel);
  }

  async dispatch(action: Action) {
    await sleep(this.delay);
    this.server.handle(action);
    this.server.broadcast(action);
  }
}
