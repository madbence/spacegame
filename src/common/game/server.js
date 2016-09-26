// @flow

import Game from './';
import {addPlayer, addShip, sync} from './actions';

import type {Action} from './actions';

type Channel = (action: Action) => void;

export default class GameServer {
  game: Game;
  channels: Channel[];
  start: number;

  constructor() {
    this.game = new Game();
    this.channels = [];
    this.start = Date.now();
  }

  join(name: string, channel: Channel): number {
    const id = this.game.addPlayer(name);
    this.channels.push(channel);
    this.broadcast(addPlayer(name));

    const add = addShip(0, id, [
      Math.random() * 80, Math.random() * 60,
    ], Math.random() * Math.PI * 2);

    this.game.addShip(add.payload.type, add.payload.owner, add.payload.pos, add.payload.ori);
    this.broadcast(add);

    channel(sync(this.game.state));

    return id;
  }

  broadcast(action: Action) {
    for (const channel of this.channels) {
      channel(action);
    }
  }

  handle(action: Action) {
    const t = (Date.now() - this.start) / 1000;
    this.game.simulate(t);
    this.game.handle(action);

    for (const player of this.game.state.players) {
      const ship = this.game.state.ships.find(ship => ship.owner === player.id);
      if (!ship) {
        setTimeout(() => {
          const ship = this.game.state.ships.find(ship => ship.owner === player.id);
          if (ship) return;
          const add = addShip(0, player.id, [
            Math.random() * 80, Math.random() * 60,
          ], Math.random() * Math.PI * 2);
          this.handle(add);
          this.broadcast(add);
        }, 5000);
      }
    }
  }
}
