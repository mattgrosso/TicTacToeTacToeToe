const express = require('express');
const uuid = require('node-uuid');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const shuffle = require('./lib/shuffle');
const path = require("path");
const Game = require("./game");
const GameManger = require("./gameManager");

var pendingPlayers = [];

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
  socket.on('disconnect', globalDisconnect);
  socket.on('rejoin_game', rejoinGame);
  socket.on('i_want_to_play_right_meow', handleLobby);
});

function globalDisconnect() {
  // If a player is in the pending player queue, remove them.
  const socket = this;
  let indexOfPlayerWhoLeft = pendingPlayers.indexOf(this);
  if (indexOfPlayerWhoLeft > -1) {
    pendingPlayers.splice(indexOfPlayerWhoLeft, 1);
  }

  console.log(this.playerInfo, 'connection lost');
}

function rejoinGame(rejoinData) {
  const socket = this;
  var gameToJoin = GameManger.findGameById(rejoinData.gameID);
  this.playerInfo = rejoinData.playerInfo;
  if (!gameToJoin) {
    console.log('No Game Found');
    return this.emit('exception', {
      msg: "Game not found.",
      type: "game_not_found"
    });
    // TODO: Make a constructor fn for 'error'?
  }

  GameManger.bindSocketToGame(socket, gameToJoin);
  socket.emit('game_start', gameToJoin);
  io.in(gameToJoin.id).emit('game_update', gameToJoin);
}

function handleLobby(playerInfo) {
  const socket = this;

  console.log('playerinfo: ', playerInfo);
  this.playerInfo = playerInfo;

  console.log(playerInfo.username, playerInfo.id, "wants to play");

  pendingPlayers.push(this);

  console.log("Pending Players", pendingPlayers.map( function (el) {
    return el.playerInfo;
    })
  );

  if (pendingPlayers.length >= 2) {
    var playersForGame = pendingPlayers.splice(0,2);
    shuffle(playersForGame);
    let game = GameManger.start(playersForGame);
    playersForGame.forEach(function bindGameUpdate(playerSocket) {
      GameManger.bindSocketToGame(playerSocket, game);
    });

    io.to(game.id).emit("game_start", game );
  }
}

const port = process.env.PORT || 3000;
const binding = 'localhost';
http.listen(port, function () {
  console.log(`MetaTacToe has been started on port http://${binding}:${port}`);
});
