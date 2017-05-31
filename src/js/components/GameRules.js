import React, { Component } from 'react';

class GameRules extends Component {
  constructor(props) {
    super(props);
    this.state = { shown: props.shown, sidebar: props.sidebar };
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick(e) {
    this.setState({ shown: !this.state.shown });

    // $('.rules-button').on('click', function rulesButton() {
    //   $(this)
    //     .html('<i class="fa fa-times" aria-hidden="true"></i>')
    //     .attr('title', 'Close Rules');
    //   $('.game-rules-sidebar').toggleClass('hidden-left');
    //   $('.hidden-left .rules-button')
    //     .html('<i class="fa fa-question-circle" aria-hidden="true"></i>')
    //     .attr('title', 'Learn to Play');
    // });
  }

  className() {
    let displayMode;
    if (this.state.sidebar) {
      displayMode = 'game-rules-sidebar';
    } else {
      displayMode = 'game-rules-on-page';
    }

    if (this.state.shown) {
      return `${displayMode}`;
    }
    return `${displayMode} hidden-left`;
  }

  title() {
    if (this.state.shown) {
      return 'Close Rules';
    }
    return 'Learn to Play';
  }

  icon() {
    if (this.state.shown) {
      return <i className="fa fa-times" aria-hidden="true" />;
    }
    return <i className="fa fa-question-circle" aria-hidden="true" />;
  }

  render() {
    return (
      <div className={this.className()}>
        <button
          title={this.title()}
          className="rules-button"
          type="button"
          name="button"
          onClick={this.handleOnClick}
        >
          {this.icon()}
        </button>
        <div className="shadow-blocker" />
        <h2>How to play</h2>
        <p>
          The goal of the game is to be the first player to win three inner games in a row. Thereby winning the outer board.
        </p>
        <p>
          The first player can play anywhere on any of the nine inner boards.
        </p>
        <p>
          Subsequent moves must be played on the board that corresponds to the position of your opponent's most recent move.
        </p>
        <p>
          For instance, if your opponent makes a move in the top-left corner of the bottom-right board, your next move will have to be somewhere in the top-left board.
        </p>
        <p>
          If your opponent forces you to make a move on a board that is already complete, you can move on any of the boards.
        </p>
        <p>
          Play proceeds in this fashion until one player has won three games in a row. They win.
        </p>
      </div>
    );
  }
}

export default GameRules;
