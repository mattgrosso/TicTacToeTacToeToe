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
      <InnerBoard position={pos} game={this.props.game[pos]} />
    ));
    return (
      <div>
        {playableBoards}
      </div>
    );
  }
}

// export default Board;
