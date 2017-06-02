import React, { Component } from 'react';

import GameStartForm from './GameStartForm';
import GameRules from './GameRules';
import Game from './Game';
import Waiting from './Waiting';
import Message from './Message';
import { PAGETITLE } from '../client';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { message: PAGETITLE };

    this.flashMessage = this.flashMessage.bind(this);
  }

  flashMessage(msg, hideAfter = 750) {
    this.setState({ message: msg });
    if (hideAfter && hideAfter > 0) {
      setTimeout(() => this.setState({ message: PAGETITLE }), hideAfter);
    }
  }

  render() {
    const {
      game,
      path,
      initalUsername,
      handleStartGameForm,
      socket,
    } = this.props;
    return (
      <div>
        {path == '/' &&
          <div>
            <Message message={this.state.message} />
            <GameStartForm
              initalUsername={initalUsername}
              submit={handleStartGameForm}
            />
            <GameRules shown sidebar={false} />
          </div>}

        {path.includes('/waiting') &&
          <div>
            <Message message="Waiting for a second player to join." />
            <Waiting />
            <GameRules shown sidebar={false} />
          </div>}
        {path.includes('/game') &&
          game &&
          <div>
            <Message message={this.state.message} />
            <Game
              game={game}
              socket={socket}
              flashMessage={this.flashMessage}
            />
            <GameRules sidebar shown={false} />
          </div>}
      </div>
    );
  }
}

export default App;
