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
    this.highlightNextBoard = this.highlightNextBoard.bind(this);
  }

  highlightNextBoard() {
    this.setState({ highlightingNextBoard: true });
    setTimeout(() => {
      this.setState({ highlightingNextBoard: false });
    }, 750);
  }

  visible() {
    const { active } = this.props;
    if (active) {
      return {
        opacity: '1',
      };
    }
    return {
      opacity: '0.5',
    };
  }

  gameOverDisplay() {
    const { winner } = this.props;
    if (winner) {
      return <div className="WinsTheGame">{winner}</div>;
    }
  }

  boards() {
    const { winner, active, nextBoard, makeMove } = this.props;
    return POSITIONS.map(pos => (
      <InnerBoard
        position={pos}
        innerGame={this.props.game[pos]}
        key={`o${pos}`}
        playable={(!nextBoard && active) || (nextBoard === pos && active)}
        nextBoard={nextBoard === pos || nextBoard === false}
        makeMove={makeMove}
        highlightNextBoard={this.highlightNextBoard}
        highlightingNextBoard={this.state.highlightingNextBoard}
      />
    ));
  }

  render() {
    const { nextBoard } = this.props;

    return (
      <section
        style={this.visible()}
        className="gameboard"
      >
        {this.gameOverDisplay()}
        {this.boards()}
      </section>
    );
  }
}

export default Board;
