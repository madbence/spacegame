import Game from './';
import {addPlayer, addShip} from './actions';

export default class GameServer {
  constructor() {
    this.game = new Game();
    this.channels = [];
  }

  join(name, channel) {
    const id = this.game.addPlayer(name);
    this.channels.push(channel);
    this.broadcast(addPlayer(name));
    this.game.addShip(name, id);
    this.broadcast(addShip(0, id, [
      Math.random() * 80, Math.random() * 60,
    ], Math.random() * Math.PI * 2));
  }

  broadcast(action) {
    for (const channel of this.channels) {
      channel(action);
    }
  }
}
