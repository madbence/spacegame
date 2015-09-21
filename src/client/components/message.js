import React from 'react';

export default class Message extends React.Component {
  displayName: 'Message'
  render() {
    return <div>{this.props.text}</div>
  }
}
