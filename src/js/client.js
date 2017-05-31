import ReactDOM from 'react-dom';
import React from 'react';
import io from 'socket.io-client';

import GameStartForm from './components/GameStartForm';
import Game from './components/Game';

import '../scss/main.scss'

const socket = io({
  transports: ['websocket'],
});

let game;
const $ui = $('#gameboard-display');
const PAGETITLE = 'MetaTacToe';

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
    history.pushState('', PAGETITLE, '/');
  }
});

/**
 * This listens for the 'game_start' event and sets the boardState var to the
 * one sent from the server.
 */
socket.on('game_start', (serverGame) => {
  game = serverGame;
  history.pushState('', PAGETITLE, `/game/${game.id}`);
  $('.waiting-gif').hide();
  $('.game-rules-on-page')
    .removeClass('game-rules-on-page')
    .addClass('game-rules-sidebar')
    .addClass('hidden-left');
  $('.new-game').hide();
  $ui.show();
  $('.resetButton').show();
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

function me() {
  return game.players.find(el => el.id === localStorage.getItem('userID'));
}

function myTurn() {
  return me().symbol === game.currentPlayer;
}

$('.rules-button').on('click', function rulesButton() {
  $(this)
    .html('<i class="fa fa-times" aria-hidden="true"></i>')
    .attr('title', 'Close Rules');
  $('.game-rules-sidebar').toggleClass('hidden-left');
  $('.hidden-left .rules-button')
    .html('<i class="fa fa-question-circle" aria-hidden="true"></i>')
    .attr('title', 'Learn to Play');
});

$('.resetButton').on('click', () => {
  goToLobby();
});

function message(messageString) {
  $('.message').text(messageString);
}

function goToLobby() {
  $ui.hide();
  $('.new-game').css({
    display: 'block',
  });
  $('#players').hide();
  $('.resetButton').hide();
  $('.waiting-gif').hide();
  history.pushState('', PAGETITLE, '/');
  message('Welcome to Meta Tac Toe');
}

function storedPlayerInfo() {
  return {
    username: localStorage.getItem('username'),
    id: localStorage.getItem('userID'),
  };
}

function handleStartGameForm(gameStartData) {
  $('.new-game').hide();
  $('#players').show();
  $('.waiting-gif').css({
    display: 'block',
  });

  message('Waiting for a second player to join.');
  localStorage.setItem('username', gameStartData.username);

  socket.emit('i_want_to_play_right_meow', {
    player: storedPlayerInfo(),
    computer: gameStartData.computer,
  });
}

const initalUsername = localStorage.getItem('username') || 'Anonymoose';

function renderApp(game) {
  ReactDOM.render(
    <div>
      {window.location.pathname == '/' &&
        <GameStartForm
          initalUsername={initalUsername}
          submit={handleStartGameForm}
        />}
      {window.location.pathname.includes('/game') &&
        game &&
        <Game game={game} socket={socket} />}
    </div>,
    document.getElementById('root'),
  );
}

renderApp(game);
