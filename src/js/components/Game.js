import React from 'react';
import PlayerList from './PlayerList';
import Board from './Board';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = { message: null };
    this.displayRelevantMessages();
    this.makeMove = this.makeMove.bind(this);
  }

  displayRelevantMessages() {
    const { game } = this.props;

    if (!this.player()) {
      this.message(
        `Spectating ${game.players[0].username} vs. ${game.players[1].username}`,
      );
      return;
    }

    if (this.playerTurn()) {
      this.message(`Your Turn. You are ${this.player().symbol}.`);
    } else {
      this.message(`Waiting for ${game.currentPlayer}`);
    }
  }

  message(msg) {
    this.setState({ message: msg });
    setTimeout(() => this.setState({ message: null }), 750);
  }

  player() {
    const { game } = this.props;
    return game.players.find(el => el.id === localStorage.getItem('userID'));
  }

  playerTurn() {
    const { game } = this.props;
    return this.player().symbol === game.currentPlayer;
  }

  /**
   * Anytime a div is clicked this records the outerPosition and innerPosition of
   * the click and checks to see three things:
   * 1. If we have a nextboard established and the outerPosition clicked does not
   *    match the nextboard it will change the message and append an aside on the
   *    correct board for 750ms.
   * 2. If the outerPosition board is already complete it says so in the message.
   * 3. If the spot clicked is already taken it says so in the message.
   * If it get's passed these three checks then it emits a 'game_update' event and
   * sends the outerPosition and innerPosition to the server. We can call this a
   * 'move'.
   */
  makeMove(event, outerPosition, innerPosition) {
    const { game, socket } = this.props;

    // Unless it is my move.
    if (!this.playerTurn()) {
      return;
    }

    if (game.nextBoard && outerPosition !== game.nextBoard) {
      this.message('You need to play on a different board.');

      // TODO: How does this get moved...?  its transisent state.
      $(document)
        .find('.nextBoard')
        .append($('<aside>Play on this board</aside>').addClass('thisOne'));
      setTimeout(() => {
        $(document).find('.thisOne').remove();
      }, 750);
    } else if (game.boardState[outerPosition].boardComplete) {
      this.message('That game is complete. Try a different board.');
    } else if (game.boardState[outerPosition][innerPosition]) {
      this.message('Someone else already went there.');
    } else {
      socket.emit('game_update', {
        outerPosition,
        innerPosition,
      });
    }
  }

  render() {
    const { game } = this.props;
    const { message } = this.state;

    return (
      <section>
        {/* TODO: Move this into a message component*/}
        {message && <p>{message}</p>}
        <PlayerList players={game.players} />

        <Board
          game={game.boardState}
          winner={game.winner}
          active={this.player() && this.playerTurn()}
          nextBoard={game.nextBoard}
          makeMove={this.makeMove}
        />
      </section>
    );
  }
}

export default Game;
