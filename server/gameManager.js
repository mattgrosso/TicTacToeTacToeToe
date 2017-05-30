const Game = require('./game');
const track = require('./lib/track');
const currentGames = [];

function findGameById(gameID) {
  return currentGames.find(el => el.id === gameID);
}

function computerMove(game) {
  const positions = [
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

  const rand = () => Math.floor(Math.random() * positions.length);
  const move = {
    outerPosition: positions[rand()],
    innerPosition: positions[rand()],
  };

  console.log(game.nextBoard);

  const illegalBoard = game.nextBoard && move.outerPosition !== game.nextBoard;
  const boardComplete = game.boardState[move.outerPosition].boardComplete;
  const illegalMove = game.boardState[move.outerPosition][move.innerPosition];

  if (illegalBoard || boardComplete || illegalMove) {
    console.log(
      'Computer chose a move that was not allowed',
      move,
      game.boardState[move.outerPosition][move.innerPosition]
    );
    return computerMove(game);
  }

  return move;
}

function bindSocketToGame(socket, game) {
  game.setPresence(socket.playerInfo.id, true);
  socket.join(game.id);
  socket.on('game_update', (move) => {
    console.log(game.id, socket.playerInfo.username, move);
    track(socket.playerInfo.id, 'game_play', 'game_update');
    game.saveMove(move);

    const computer = game.playerByID('computer');
    if (computer && computer.symbol === game.currentPlayer) {
      console.log("it's the computers move");
      const move = computerMove(game);
      console.log(move);
      game.saveMove(move);
    }

    socket.server.to(game.id).emit('game_update', game);
  });

  /**
   * Bind to disconnect in the scope of a game to mark a player offline when a connection is lost.
   *
   * Triggers a gameUpdate with the updated player states.
   */
  socket.on('disconnect', () => {
    game.setPresence(socket.playerInfo.id, false);
    socket.server.to(game.id).emit('game_update', game);
  });
}

function start(players) {
  const game = new Game(players);
  currentGames.push(game);
  return game;
}

module.exports = {
  bindSocketToGame,
  findGameById,
  start,
};
