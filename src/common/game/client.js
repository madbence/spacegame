import Game from './';
import {THRUST, SHOOT} from './actions';

export default class GameClient {
  constructor(name) {
    this.name = name;
    this.game = new Game();
    this.start = Date.now();
  }

  join(server) {
    this.server = server;
    return server.join(this.name, action => {
      if (action.type == 'sync') {
        this.game.state = action.state;
        return;
      }
      this.game.handle(action);
    });
  }

  dispatch(action) {
    return this.server.dispatch(action);
  }

  thrust(id, index, strength) {
    const t = (Date.now() - this.start) / 1000;
    this.dispatch({
      type: THRUST,
      id,
      index,
      strength,
      t,
    });
  }

  shoot(id) {
    const t = (Date.now() - this.start) / 1000;
    this.dispatch({
      type: SHOOT,
      id,
      t,
    })
  }
}
