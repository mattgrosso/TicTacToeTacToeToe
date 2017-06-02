import React, { Component } from 'react';

class LeaveGame extends Component {
  render() {
    return (
      <button
        title="Exit and Start a New Game"
        className="resetButton"
        type="button"
        name="button"
        onClick={this.props.leave}
      >
        <i className="fa fa-times" aria-hidden="true" />
      </button>
    );
  }
}

export default LeaveGame;
