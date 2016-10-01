// @flow

import Game from './';
import {ADD_SHIP, ADD_PLAYER} from './actions';

import type {Action} from './actions';

type Channel = (action: Action) => void;

export default class GameServer {
  game: Game;
  channels: Channel[];

  constructor() {
    this.game = new Game();
    this.channels = [];
    this.start = Date.now();
  }

  join(name: string, channel: Channel): number {
    const t = (Date.now() - this.start) / 1000;
    this.channels.push(channel);
    const id = this.game.addPlayer(name, t);
    const a = {
      type: ADD_SHIP,
      ship: 0,
      owner: id,
      pos: [Math.random() * 40, Math.random() * 30],
      ori: Math.random() * Math.PI * 2,
    }
    this.game.addShip(a.ship, a.owner, a.pos, a.ori);

    channel({
      type: 'sync',
      state: this.game.state,
    });

    this.broadcast({
      type: ADD_PLAYER,
      name,
      t,
    });

    this.broadcast(a);

    return id;
  }

  broadcast(action) {
    for (let channel of this.channels) {
      channel(action);
    }
  }


  dispatch(action: Action) {
    const now = (Date.now() - this.start) / 1000;
    action.t = now;
    this.game.handle(action);
    this.broadcast(action);
  }
}
