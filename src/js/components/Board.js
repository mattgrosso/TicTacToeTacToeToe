// import React, { Component } from 'react';
const POSITIONS = [
  "topLeft",
  "topCenter",
  "topRight",
  "middleLeft",
  "middleCenter",
  "middleRight",
  "bottomLeft",
  "bottomCenter",
  "bottomRight"
];

class Board extends React.Component {
  render() {
    const { winner } = this.props;
    const playableBoards = POSITIONS.map(pos => (
      <InnerBoard position={pos} innerGame={this.props.game[pos]} />
    ));

    let winnerElement;
    if (winner) {
      winnerElement = <div className="WinsTheGame">{winner}</div>
    } else {
      winnerElement = null
    }

    return (
      <section>
        {winnerElement}
        {playableBoards}
      </section>
    );
  }
}

// export default Board;
