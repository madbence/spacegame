import Inferno from 'inferno';
import Component from 'inferno-component';

import canvas from './canvas';
import Game from '../../../common/game';
import Controller from './control';
import AIController from '../../../common/game/ai';
import {addShip} from '../../../common/game/actions';

import Server from '../../../common/game/server';
import Client from '../../../common/game/client';
const server = new Server();

export default class GameComponent extends Component {
  constructor(props) {
    super(props);

    const client = new Client('me');
    client.join(server);

    for (let i = 1; i < 10; i++) {
      const ai = new Client('AI ' + i);
      ai.join(server);
      new AIController(client.game, i);
    }

    const controller = new Controller(client.game, 0);

    const start = Date.now();

    const frame = () => {
      const now = (Date.now() - start) / 1000;
      const next = client.game.simulate(now);
      if (next !== this.state) {
        this.setState(next);
      }
      return requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);

  }

  render() {
    this.checkCanvas();
    this.renderCanvas();
    return (
      <div>
        <h1>SpaceGame</h1>
        <canvas ref='canvas' width='800' height='600'>Canvas not supported!</canvas>
      </div>
    );
  }

  componentDidMount() {
    this.checkCanvas();
  }

  checkCanvas() {
    if (!this.ctx && this.refs.canvas) {
      this.ctx = this.refs.canvas.getContext('2d');
    }
  }

  renderCanvas() {
    if (!this.ctx) return;
    canvas(this.ctx, this.state);
  }
}
