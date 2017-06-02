import React from 'react';
import { POSITIONS } from './Board';

class InnerBoard extends React.Component {
  render() {
    const {
      position,
      innerGame,
      playable,
      nextBoard,
      makeMove,
      highlightNextBoard,
      highlightingNextBoard,
    } = this.props;
    let style;
    if (playable) {
      style = {
        cursor: 'pointer',
      };
    } else {
      style = {
        cursor: 'not-allowed',
      };
    }

    const playableSquares = POSITIONS.map(pos => (
      <div
        style={style}
        key={`i${pos}`}
        className={`inner ${pos}`}
        onClick={(e) => {
          if (!nextBoard) {
            highlightNextBoard();
          }

          makeMove(e, position, pos);
        }}
      >
        {innerGame[pos]}
      </div>
    ));

    return (
      <section
        className={`outer ${position} ${`${innerGame.winner}Winner`} ${nextBoard ? 'nextBoard' : ''}`}
      >
        <div className="XWins">X</div>
        <div className="OWins">O</div>
        <div className="CWins">C</div>
        {highlightingNextBoard &&
          nextBoard &&
          <aside className="thisOne">Play on this board</aside>}
        {playableSquares}
      </section>
    );
  }
}

export default InnerBoard;
