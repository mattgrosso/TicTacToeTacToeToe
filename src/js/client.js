import ReactDOM from 'react-dom';
import React from 'react';
import io from 'socket.io-client';
import _hijackPushState from './utils/pushState';

import App from './components/App';

import '../scss/main.scss'

const socket = io({
  transports: ['websocket'],
});

let game;
export const PAGETITLE = 'MetaTacToe';

/**
 * This listens for the 'connected' event and just logs what the server says.
 */
socket.on('connected', (id) => {
  if (!localStorage.getItem('userID')) {
    localStorage.setItem('userID', id);
  }
  const pathComponents = window.location.pathname.split('/');
  if (pathComponents[1] === 'game' && pathComponents[2]) {
    const gameID = pathComponents[2];
    socket.emit('rejoin_game', {
      gameID,
      playerInfo: storedPlayerInfo(),
    });
  }

  console.log('Connected to Server');
});

/**
 *
 */
socket.on('exception', (error) => {
  message(error.msg);
  if (error.type === 'game_not_found') {
    goTo('/')
  }
});

/**
 * This listens for the 'game_start' event and sets the boardState var to the
 * one sent from the server.
 */
socket.on('game_start', (serverGame) => {
  game = serverGame;
  goTo(`/game/${game.id}`);
  renderApp(game);
});

/**
 * This listens for the 'game_update' event and runs the saveAndDisplayMove fn
 * to modify the user's board based on current game state.
 */
socket.on('game_update', (serverGame) => {
  game = serverGame;
  renderApp(game);
});

socket.on('error', (errorMessage) => {
  message(errorMessage);
});

function storedPlayerInfo() {
  return {
    username: localStorage.getItem('username'),
    id: localStorage.getItem('userID'),
  };
}

function handleStartGameForm(gameStartData) {
  goTo('/waiting');

  localStorage.setItem('username', gameStartData.username);

  socket.emit('i_want_to_play_right_meow', {
    player: storedPlayerInfo(),
    computer: gameStartData.computer,
  });
}

export function goTo(path) {
  // Pass the path into the state.
  // This is used because when a window history popstate event occurs the STATE is what is passed in to that event.
  history.pushState(path, PAGETITLE, path);
}

const initalUsername = localStorage.getItem('username') || 'Anonymoose';

function renderApp(game, path = window.location.pathname) {
  ReactDOM.render(
    <App
      game={game}
      path={path}
      initalUsername={initalUsername}
      handleStartGameForm={handleStartGameForm}
      socket={socket}
    />,
    document.getElementById('root'),
  );
}

// Handle the initial route
renderApp(game);

function navigated(event) {
  console.log(
    `location: ${document.location}, state: ${JSON.stringify(event.state)}`,
  );

  renderApp(game, event.state);
}

// Handle browser navigation events
window.onpopstate = history.onpushstate = navigated;
