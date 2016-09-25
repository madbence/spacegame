import Game from './';

export default class GameClient {
  constructor(name) {
    this.name = name;
    this.game = new Game();
  }

  join(server) {
    server.join(this.name, action => this.game.handle(action));
  }
}
