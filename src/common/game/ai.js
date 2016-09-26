import {thrust, shoot} from './actions';

export default class AIController {
  constructor(client, id) {
    this.client = client;
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
    const ship = this.client.game.state.ships.find(ship => ship.owner === this.id);
    if (!ship) return;
    this.client.dispatch(shoot(ship.id));
  }

  thrust() {
    const ship = this.client.game.state.ships.find(ship => ship.owner === this.id);
    if (!ship) return;
    const idx = Math.floor(Math.random() * 4);
    this.client.dispatch(thrust(ship.id, idx, Math.random()));
  }
}
