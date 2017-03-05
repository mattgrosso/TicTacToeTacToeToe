const express = require('express');
const uuid = require('node-uuid');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const shuffle = require('./lib/shuffle');
const path = require("path");
const Game = require("./game");

var pendingPlayers = [];
var currentGames = [];

app.use(function (req, res, next) {
  console.log("New request to ", req.path);
  next();
});

app.use(express.static('build'));

app.get("/game/:gameID", function getGame(req, res) {
  res.sendFile(path.join(__dirname+'/../build/index.html'));
});

io.on('connection', function (socket) {
  console.log('connection established', socket.id);
  socket.emit("connected", uuid.v4());

  socket.on('disconnect', function () {
    // If a player is in the pending player queue, remove them.
    let indexOfPlayerWhoLeft = pendingPlayers.indexOf(socket);
    if (indexOfPlayerWhoLeft > -1) {
      pendingPlayers.splice(indexOfPlayerWhoLeft, 1);
    }

    console.log(socket.playerInfo, 'connection lost');
  });

  socket.on('rejoin_game', function (rejoinData) {
    var gameToJoin = findGameById(rejoinData.gameID);
    socket.playerInfo = rejoinData.playerInfo;
    if (!gameToJoin) {
      console.log('No Game Found');
      return socket.emit('exception', {
        msg: "Game not found.",
        type: "game_not_found"
      });
      // TODO: Make a constructor function for 'error'?
    }

    bindSocketToGame(socket, gameToJoin);
    socket.emit('game_start', gameToJoin);
    io.in(gameToJoin.id).emit('game_update', gameToJoin);
  });

  socket.on('i_want_to_play_right_meow', function handleLobby(playerInfo) {
    console.log('playerinfo: ', playerInfo);
    socket.playerInfo = playerInfo;

    console.log(playerInfo.username, playerInfo.id, "wants to play");

    pendingPlayers.push(socket);

    console.log("Pending Players", pendingPlayers.map( function (el) {
      return el.playerInfo;
      })
    );

    if (pendingPlayers.length >= 2) {
      var playersForGame = pendingPlayers.splice(0,2);
      shuffle(playersForGame);
      var game = new Game(playersForGame);
      currentGames.push(game);

      playersForGame.forEach(function bindGameUpdate(playerSocket) {
        bindSocketToGame(playerSocket, game);
      });

      io.to(game.id).emit("game_start", game );
    }
  });
});

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
    io.to(game.id).emit('game_update', game);
  });

  /**
   * Bind to disconnect in the scope of a game to mark a player offline when a connection is lost.
   *
   * Triggers a gameUpdate with the updated player states.
   */
  socket.on('disconnect', function gameDisconnect() {
    game.setPresence(socket.playerInfo.id, false);
    io.to(game.id).emit('game_update', game);
  })
}

const port = process.env.PORT || 3000;
const binding = 'localhost';
http.listen(port, function () {
  console.log(`MetaTacToe has been started on port ${binding}:${port}`);
});
