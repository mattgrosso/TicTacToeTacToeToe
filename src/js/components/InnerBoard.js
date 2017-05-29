// import React, { Component } from "react";

class InnerBoard extends React.Component {
  render() {
    const { position, innerGame } = this.props;
    const playableSquares = POSITIONS.map(pos => (
      <div className={`inner ${pos}`}>
        {innerGame[pos]}
      </div>
    ));
    return (
      <section className={`outer ${position}`}>
        <div className="XWins">X</div>
        <div className="OWins">O</div>
        <div className="CWins">C</div>
        {playableSquares}
      </section>
    );
  }
}

// export default InnerBoard;
