import React from 'react';

export default class Message extends React.Component {
  displayName: 'Message'
  render() {
    if (!this.props.date) {
      return (
        <div className='message pending'>
          { this.props.text }
        </div>
      );
    }
    return (
      <div className='message'>
        <span className='author'>{ this.props.author }: </span>
        { this.props.text }
      </div>
    );
  }
}
