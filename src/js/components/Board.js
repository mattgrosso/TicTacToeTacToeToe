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
    const playableBoards = POSITIONS.map(pos => (
      <InnerBoard position={pos} innerGame={this.props.game[pos]} />
    ));
    return (
      <section>
        {playableBoards}
      </section>
    );
  }
}

// export default Board;
