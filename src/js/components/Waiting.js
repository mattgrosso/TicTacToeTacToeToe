import React, { Component } from 'react';

class Waiting extends Component {
  render() {
    return (
      <iframe
        className="waiting-gif giphy-embed"
        src="//giphy.com/embed/UxREcFThpSEqk"
        width="480"
        height="264"
        frameBorder="0"
        allowFullScreen
      />
    );
  }
}

export default Waiting;
