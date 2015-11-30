import React from 'react';
import { attach, detach } from '../render';

export default class Game extends React.Component {
  componentDidMount() {
    attach(this.refs.canvas);
  }
  componentWillUnmount() {
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
