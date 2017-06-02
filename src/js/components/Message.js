import React, { Component } from 'react';

class Message extends Component {
  render() {
    return <h2 className="message">{this.props.message}</h2>;
  }
}

export default Message;
