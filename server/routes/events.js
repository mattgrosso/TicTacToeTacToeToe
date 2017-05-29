const uuid = require("node-uuid");
const GameManger = require("../gameManager");
const shuffle = require("../lib/shuffle");

module.exports = function(io) {
  var pendingPlayers = [];

  io.on("connection", function(socket) {
    console.log("connection established", socket.id);
    socket.emit("connected", uuid.v4());
    socket.on("disconnect", globalDisconnect);
    socket.on("rejoin_game", rejoinGame);
    socket.on("i_want_to_play_right_meow", handleLobby);
  });

  function globalDisconnect() {
    // If a player is in the pending player queue, remove them.
    const socket = this;
    let indexOfPlayerWhoLeft = pendingPlayers.indexOf(this);
    if (indexOfPlayerWhoLeft > -1) {
      pendingPlayers.splice(indexOfPlayerWhoLeft, 1);
    }
    console.log(this.playerInfo, "connection lost");
  }

  function rejoinGame(rejoinData) {
    const socket = this;
    var gameToJoin = GameManger.findGameById(rejoinData.gameID);
    this.playerInfo = rejoinData.playerInfo;
    if (!gameToJoin) {
      console.log("No Game Found");
      return this.emit("exception", {
        msg: "Game not found.",
        type: "game_not_found"
      });
      // TODO: Make a constructor fn for 'error'?
    }

    GameManger.bindSocketToGame(socket, gameToJoin);
    socket.emit("game_start", gameToJoin);
    io.in(gameToJoin.id).emit("game_update", gameToJoin);
  }

  function handleLobby(data) {
    const playerInfo = data.player;
    const socket = this;

    console.log("playerinfo: ", playerInfo);
    socket.playerInfo = playerInfo;

    console.log(playerInfo.username, playerInfo.id, "wants to play");

    if (data.computer) {
      playComputer(socket);
    } else {
      playHuman(socket);
    }
  }

  function playComputer(socket) {
    let playersForGame = [];
    playersForGame.push(socket);
    playersForGame.push({
      playerInfo: {
        id: "computer",
        username: "computer"
      }
    });

    let game = GameManger.start(playersForGame);
    GameManger.bindSocketToGame(socket, game);
    io.to(game.id).emit("game_start", game);
  }

  function playHuman(socket) {
    pendingPlayers.push(socket);

    console.log(
      "Pending Players",
      pendingPlayers.map(function(el) {
        return el.playerInfo;
      })
    );

    if (pendingPlayers.length >= 2) {
      var playersForGame = pendingPlayers.splice(0, 2);
      shuffle(playersForGame);
      let game = GameManger.start(playersForGame);
      playersForGame.forEach(function bindGameUpdate(playerSocket) {
        GameManger.bindSocketToGame(playerSocket, game);
      });

      io.to(game.id).emit("game_start", game);
    }
  }
};
