import React from 'react';
import { attach, detach } from '../render';
import sandbox from '../lib/sandbox';

export default class Game extends React.Component {
  componentDidMount() {
    // controls
    // TODO: pull code from editor and update dynamically
    const workerjs = `
    const keys = {
      A: 65,
      D: 68,
      W: 87,
      SPACE: 32,
    };

    helpers.addKeyListener(keys.W, () => actions.accelerate(0, 1), () => actions.accelerate(0, 0));
    helpers.addKeyListener(keys.A, () => actions.accelerate(1, 1), () => actions.accelerate(1, 0));
    helpers.addKeyListener(keys.D, () => actions.accelerate(2, 1), () => actions.accelerate(2, 0));
    helpers.addKeyListener(keys.SPACE, actions.fire, undefined, true);

    setInterval(() => console.log(getState()), 1000);
    `;

    sandbox.onerror = (e) => console.log(e); // TODO: display error to user
    sandbox.code = workerjs;
    sandbox.start();

    // rendering
    attach(this.refs.canvas);
  }

  componentWillUnmount() {
    sandbox.stop();
    detach();
  }

  render() {
    return (
      <div id='game'>
        <canvas id='canvas' width='1000' height='500' ref='canvas'>
          Canvas not supported!
        </canvas>
        <pre>{JSON.stringify(this.props, null, 2)}</pre>
      </div>
    );
  }
}
