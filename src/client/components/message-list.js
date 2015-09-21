import React from 'react';
import Message from 'client/components/message';

export default class MessageList extends React.Component {
  displayName: 'MessageList'
  render() {
    const messages = this.props.messages.map(message => <Message {...message} />);

    return (
      <div className='messages'>
        {messages}
      </div>
    )
  }
}
