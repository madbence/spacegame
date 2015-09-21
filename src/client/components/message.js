import React from 'react';

export default class Message extends React.Component {
  displayName: 'Message'
  render() {
    return <div className='message'>{this.props.text}</div>
  }
}
