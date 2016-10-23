import Inferno from 'inferno';
import Component from 'inferno-component';

import WebGLCanvas from './webgl';
import Game from '../../../common/game';
import Controller from './control';
import AIController from '../../../common/game/ai';

import Server from '../../../common/game/server';
import ServerProxy from '../../../common/game/server-proxy';
import Client from '../../../common/game/client';

const server = new Server();

export default class GameComponent extends Component {
  constructor(props) {
    super(props);

    let client = new Client('me');
    const proxy = new ServerProxy(100, server);

    setTimeout(() => {
      client.join(proxy).then(id => {
        client.id = id;
        new Controller(client, id);
      });
    }, 100);

    for (let i = 0; i < 5; i++) {
      const c = new Client('ai ' + i);
      c.join(proxy).then(id => {
        new AIController(c, id);
      });
    }

    const frame = () => {
      client.simulate();
      if (this.canvas) {
        this.canvas.render(client.game.state, client.id);
      }
      return requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  }

  render() {
    return (
      <div>
        <h1>SpaceGame</h1>
        <canvas ref='canvas'>Canvas not supported!</canvas>
      </div>
    );
  }

  componentDidMount() {
    this.canvas = new WebGLCanvas(this.refs.canvas);
  }
}
