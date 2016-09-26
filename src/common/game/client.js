import Game from './';

export default class GameClient {
  constructor(name) {
    this.name = name;
    this.game = new Game();
  }

  join(server) {
    this.server = server;
    return server.join(this.name, action => {
      this.game.handle(action);
    });
  }

  dispatch(action) {
    return this.server.dispatch(action);
  }
}
