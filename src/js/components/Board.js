import React from 'react';
import InnerBoard from './InnerBoard';

export const POSITIONS = [
  'topLeft',
  'topCenter',
  'topRight',
  'middleLeft',
  'middleCenter',
  'middleRight',
  'bottomLeft',
  'bottomCenter',
  'bottomRight',
];

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = { highlightingNextBoard: false };
    this.highlightNextBoard = this.highlightNextBoard.bind(this)
  }

  highlightNextBoard() {
    this.setState({ highlightingNextBoard: true });
    setTimeout(() => {
      this.setState({ highlightingNextBoard: false });
    }, 750);
  }

  render() {
    const { winner, active, nextBoard, makeMove } = this.props;
    const playableBoards = POSITIONS.map(pos => (
      <InnerBoard
        position={pos}
        innerGame={this.props.game[pos]}
        key={`o${pos}`}
        playable={(!nextBoard && active) || (nextBoard === pos && active)}
        nextBoard={nextBoard === pos}
        makeMove={makeMove}
        highlightNextBoard={this.highlightNextBoard}
        highlightingNextBoard={this.state.highlightingNextBoard}
      />
    ));

    let winnerElement;
    if (winner) {
      winnerElement = <div className="WinsTheGame">{winner}</div>;
    } else {
      winnerElement = null;
    }

    let style;
    if (active) {
      style = {
        opacity: '1',
      };
    } else {
      style = {
        opacity: '0.5',
      };
    }

    return (
      <section
        style={style}
        className={`gameboard ${nextBoard ? '' : 'nextBoard'}`}
      >
        {winnerElement}
        {playableBoards}
      </section>
    );
  }
}

export default Board;
