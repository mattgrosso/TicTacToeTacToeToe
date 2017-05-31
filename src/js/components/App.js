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

  flashMessage(msg) {
    this.setState({ message: msg });

    setTimeout(() => this.setState({ message: PAGETITLE }), 750);
  }

  render() {
    const { game, path, initalUsername, handleStartGameForm, socket } = this.props;
    return (
      <div>
        <Message message={this.state.message} />
        {path == '/' &&
          <GameStartForm
            initalUsername={initalUsername}
            submit={handleStartGameForm}
          />}
        {path.includes('/waiting') &&
          <div>
            <Message message="Waiting for a second player to join." />
            <Waiting />
            <GameRules shown={true} sidebar={false} />
          </div>}
        {path.includes('/game') &&
          game &&
          <div>
            <Game
              game={game}
              socket={socket}
              flashMessage={this.flashMessage}
            />
            <GameRules sidebar={true} shown={false}/>
          </div>}
      </div>
    );
  }
}

export default App;
