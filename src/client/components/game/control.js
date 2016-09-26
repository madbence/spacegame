import {shoot, thrust} from '../../../common/game/actions';

export default class GameController {
  constructor(client, id) {
    this.client = client;
    this.id = id;

    const handlers = {
      'keydown': {
        'w': () => this.thrust(1, 1),
        's': () => this.thrust(0, 1),
        'a': () => this.thrust(2, 1),
        'd': () => this.thrust(3, 1),
        ' ': () => this.shoot(),
      },
      'keyup': {
        'w': () => this.thrust(1, 0),
        's': () => this.thrust(0, 0),
        'a': () => this.thrust(2, 0),
        'd': () => this.thrust(3, 0),
      },
    }

    const handle = e => {
      if (handlers[e.type] && handlers[e.type][e.key]) {
        e.preventDefault();
        handlers[e.type][e.key](e);
      }
    }

    document.addEventListener('keydown', handle);
    document.addEventListener('keyup', handle);
  }

  thrust(index, strength) {
    const ship = this.client.game.state.ships.find(ship => ship.owner === this.id);

    if (!ship) {
      throw new Error(`Player ${this.id} has no ship!`);
    }

    this.client.dispatch(thrust(ship.id, index, strength));
  }

  shoot() {
    const ship = this.client.game.state.ships.find(ship => ship.owner === this.id);

    if (!ship) {
      throw new Error(`Player ${this.id} has no ship!`);
    }

    this.client.dispatch(shoot(ship.id));
  }
}
