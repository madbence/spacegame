import React from 'react';

export default class MessageForm extends React.Component {
  displayName: 'MessageForm'

  render() {
    return (
      <div className='message-form'>
        <input type='text' ref='message'/>
        <button onClick={ this.onClick.bind(this) }>Küldés</button>
      </div>
    );
  }

  onClick() {
    this.props.onSubmit(React.findDOMNode(this.refs.message).value);
  }
}
