const Game = require('./game');
let currentGames = [];

function findGameById(gameID) {
  return currentGames.find(function (el) {
    return el.id === gameID;
  });
}

function bindSocketToGame(socket, game) {
  game.setPresence(socket.playerInfo.id, true);
  socket.join(game.id);
  socket.on('game_update', function (move) {
    console.log(game.id, socket.playerInfo.username, move);
    game.saveMove(move);
    socket.server.to(game.id).emit('game_update', game);
  });

  /**
   * Bind to disconnect in the scope of a game to mark a player offline when a connection is lost.
   *
   * Triggers a gameUpdate with the updated player states.
   */
  socket.on('disconnect', function gameDisconnect() {
    game.setPresence(socket.playerInfo.id, false);
    socket.server.to(game.id).emit('game_update', game);
  })
}

function start(players) {
  const game = new Game(players);
  currentGames.push(game);
  return game;
}

module.exports = {
  bindSocketToGame,
  findGameById,
  start
}