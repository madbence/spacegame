import Inferno from 'inferno';
import Component from 'inferno-component';

import canvas from './canvas';
import Game from '../../../common/game';
import Controller from './control';
import AIController from '../../../common/game/ai';

import Server from '../../../common/game/server';
import ServerProxy from '../../../common/game/server-proxy';
import Client from '../../../common/game/client';

export default class GameComponent extends Component {
  constructor(props) {
    super(props);

    const start = Date.now();
    const client = new Client('me');
    const server = new Server();
    const proxy = new ServerProxy(100, server);

    client.join(proxy).then(id => {
      new Controller(client, id);
    });

    for (let i = 0; i < 2; i++) {
      const c = new Client('ai ' + i);
      c.join(proxy).then(id => {
        new AIController(c, id);
      });
    }

    const frame = () => {
      const now = (Date.now() - start) / 1000;
      client.game.simulate(now);
      this.renderCanvas(client.game.state);
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

  renderCanvas(state) {
    if (!this.ctx) return;
    canvas(this.ctx, state);
  }
}
