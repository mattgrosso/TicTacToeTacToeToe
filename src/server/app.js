var express = require('express');
var uuid = require('node-uuid');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var pendingPlayers = [];

app.use(function (req, res, next) {
  console.log("New request to ", req.path);
  next();
});

app.use(express.static('build'));

io.on('connection', function (socket) {
  console.log('connection established', socket.id);
  socket.emit("connected", {});

  socket.on('disconnect', function () {
    console.log('connection lost');
  });

  socket.on('i_want_to_play_right_meow', function handleLobby() {
    console.log(socket.id, "wants to play");
    pendingPlayers.push(socket);

    if (pendingPlayers.length >= 2) {
      var playersForGame = pendingPlayers.splice(0,2);
      var game = new Game(playersForGame);

      // Subscribe the selected players to the new game room.
      playersForGame[0].join(game.id);
      playersForGame[1].join(game.id);

      io.to(game.id).emit("game_start", game );

      socket.on('game_update', function (move) {
        console.log(move);
        io.to(game.id).emit('game_update', game);
      });
    }
  });
});

function Game(players) {
  return {
    id: uuid.v4(),
    currentPlayer: "X",
    nextBoard: false,
    players: [
      { id: players[0].id, symbol: "X" },
      { id: players[1].id, symbol: "O" }
    ],
    boardState: {
      'topLeft': {},
      'topCenter': {},
      'topRight': {},
      'middleLeft': {},
      'middleCenter': {},
      'middleRight': {},
      'bottomLeft': {},
      'bottomCenter': {},
      'bottomRight': {},
      'catsCount': 0
    }
  };
}


http.listen(3000, function () {
  console.log('Example app running on port 3000!');
});
