import React from 'react';
import AceEditor from 'react-ace';
import sandbox from '../lib/sandbox';

import 'brace/mode/javascript';
import 'brace/theme/github';

const defaultjs =
`const keys = {
  A: 65,
  D: 68,
  W: 87,
  SPACE: 32,
};

helpers.addKeyListener(keys.W, () => actions.accelerate(0, 1), () => actions.accelerate(0, 0));
helpers.addKeyListener(keys.A, () => actions.accelerate(1, 1), () => actions.accelerate(1, 0));
helpers.addKeyListener(keys.D, () => actions.accelerate(2, 1), () => actions.accelerate(2, 0));
helpers.addKeyListener(keys.SPACE, actions.fire, undefined, true);

setInterval(() => console.log(getState()), 1000);`;

export default class EditorPane extends React.Component {
  displayName: 'EditorPane';

  constructor(props) {
    super(props);

    this.state = {
      value: this.props.value || defaultjs,
      codeRunning: '',
    };
  }

  componentDidMount() {
    // controls
    sandbox.onerror = (e) => console.log(e); // TODO: display error to user
    this.runCode();
  }

  componentWillUnmount() {
    sandbox.stop();
  }

  get hasCodeChanged() {
    return this.state.value !== this.state.codeRunning;
  }

  onChange(newValue) {
    this.setState({ value: newValue });
  }

  runCode() {
    this.setState({ codeRunning: this.state.value });

    sandbox.stop();
    sandbox.code = this.state.value;
    sandbox.start();
  }

  onEditorFocus() {
    sandbox.disableKeyListeners();
  }

  onEditorBlur() {
    sandbox.enableKeyListeners();
  }

  render() {
    const labelText = this.hasCodeChanged
                        ? 'Code changed. Hit "Run!" to reload code.'
                        : 'Latest code running.';
    const labelStyle = this.hasCodeChanged
                        ? { color: 'red' }
                        : { color: 'green' };

    return (
      <div>
        <AceEditor
          mode='javascript'
          theme='github'
          value={this.state.value}
          width={this.props.editorWidth}
          height={this.props.editorHeight}
          onChange={this.onChange.bind(this)}
          onFocus={this.onEditorFocus.bind(this)}
          onBlur={this.onEditorBlur.bind(this)}
          editorProps={{$blockScrolling: true}}
        />
        <button onClick={this.runCode.bind(this)}>
          Run!
        </button>
        <p style={labelStyle}>
          {labelText}
        </p>
      </div>
    );
  }
}
