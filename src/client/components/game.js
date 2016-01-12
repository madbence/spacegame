import React from 'react';
import EditorPane from './editorPane';
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
        <EditorPane
          editorWidth='1000'
          editorHeight='200'
        />
        <pre>{JSON.stringify(this.props, null, 2)}</pre>
      </div>
    );
  }
}
