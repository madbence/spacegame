import {thrust, shoot} from './actions';

export default class AIController {
  constructor(game, id) {
    this.game = game;
    this.id = id;

    const s = () => {
      this.shoot();
      setTimeout(s, 1500 + 1000 * Math.random());
    };

    const t = () => {
      this.thrust();
      setTimeout(t, 4000 + 2000 * Math.random());
    };

    setTimeout(s, Math.random() * 1000);
    setTimeout(t, Math.random() * 5000);
  }

  shoot() {
    const ship = this.game.state.ships.find(ship => ship.owner === this.id);
    if (!ship) return;
    this.game.handle(shoot(ship.id));
  }

  thrust() {
    const ship = this.game.state.ships.find(ship => ship.owner === this.id);
    if (!ship) return;
    const idx = Math.floor(Math.random() * 4);
    this.game.handle(thrust(ship.id, idx, Math.random()));
  }
}
