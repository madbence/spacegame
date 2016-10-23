import Game from './';
import {THRUST, SHOOT} from './actions';

export default class GameClient {
  constructor(name) {
    this.name = name;
    this.game = new Game();
    this.snapshot = null;
    this.queue = [];
    this.start = Date.now();
  }

  join(server) {
    this.server = server;
    return server.join(this.name, action => {
      // if (this.name == 'me') console.log(action);
      if (action.type == 'sync') {
        this.game.state = action.state;
        this.snapshot = action.state;
        return;
      }
      this.start = Date.now() - action.t * 1000;
      this.game.state = this.snapshot;
      this.game.handle(action);
      this.snapshot = this.game.state;
      this.queue = this.queue.filter(a => a.t > action.t);
      // if (this.name == 'me') console.log(this.queue.length);
      for (const a of this.queue) {
        this.game.handle(a);
      }
    });
  }

  simulate() {
    const now = (Date.now() - this.start) / 1000;
    this.game.simulate(now);
  }

  dispatch(action) {
    const now = (Date.now() - this.start) / 1000;
    action.t = now;
    this.queue.push(action)
    this.game.handle(action);
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
