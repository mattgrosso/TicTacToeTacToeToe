const uuid = require('node-uuid');

module.exports = function Game(players) {
  return {
    id: uuid.v4(),
    currentPlayer: "X",
    nextBoard: false,
    players: [
      { id: players[0].playerInfo.id, username: players[0].playerInfo.username, socketId: players[0].id, symbol: "X", status: { online: true, at: Date.now() } },
      { id: players[1].playerInfo.id, username: players[1].playerInfo.username, socketId: players[1].id, symbol: "O", status: { online: true, at: Date.now() } }
    ],
    // This goes upon playerID vs socket,  this allows a reconnected player to retoggle their status to online
    // Also, do not crash if the player is not a player on the game (allow spectator mode)
    setPresence: function setPresence(playerId, status){
      let player = this.playerByID(playerId)
      if (player) {
        player.status = {
          online: status, 
          at: Date.now()
        };
      }
    },
    playerByID: function playerByID(playerID) {
      return this.players.filter( p => p.id == playerID)[0]
    },
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
      'catsCount': 0,
      'completeGameCount': 0
    },
    winner: null,
    saveMove: function saveMove(move) {
        var innerPosition = move.innerPosition;
        var outerPosition = move.outerPosition;

        this.boardState[outerPosition][innerPosition] = this.currentPlayer;
        this.boardWon(this.boardState[outerPosition], outerPosition);

        this.whatBoardNext(innerPosition);
        this.togglePlayer();
      },
    //'bo' is a Board Object
    //'boPosition' is the outer position of bo
    boardWon: function boardWon(bo, boPosition) {
      var boardState = this.boardState;

      if ((bo.topLeft) && (bo.topLeft === bo.topCenter) && (bo.topLeft === bo.topRight)) {
        bo.winner = bo.topLeft;
        bo.boardComplete = true;
        boardState.completeGameCount++;
        this.gameOver(boardState);
      }
      else if ((bo.middleLeft) && (bo.middleLeft === bo.middleCenter) && (bo.middleLeft === bo.middleRight)) {
        bo.winner = bo.middleLeft;
        bo.boardComplete = true;
        boardState.completeGameCount++;
        this.gameOver(boardState);
      }
      else if ((bo.bottomLeft) && (bo.bottomLeft === bo.bottomCenter) && (bo.bottomLeft === bo.bottomRight)) {
        bo.winner = bo.bottomLeft;
        bo.boardComplete = true;
        boardState.completeGameCount++;
        this.gameOver(boardState);
      }
      else if ((bo.topLeft) && (bo.topLeft === bo.middleLeft) && (bo.topLeft === bo.bottomLeft)) {
        bo.winner = bo.topLeft;
        bo.boardComplete = true;
        boardState.completeGameCount++;
        this.gameOver(boardState);
      }
      else if ((bo.topCenter) && (bo.topCenter === bo.middleCenter) && (bo.topCenter === bo.bottomCenter)) {
        bo.winner = bo.topCenter;
        bo.boardComplete = true;
        boardState.completeGameCount++;
        this.gameOver(boardState);
      }
      else if ((bo.topRight) && (bo.topRight === bo.middleRight) && (bo.topRight === bo.bottomRight)) {
        bo.winner = bo.topRight;
        bo.boardComplete = true;
        boardState.completeGameCount++;
        this.gameOver(boardState);
      }
      else if ((bo.topLeft) && (bo.topLeft === bo.middleCenter) && (bo.topLeft === bo.bottomRight)) {
        bo.winner = bo.topLeft;
        bo.boardComplete = true;
        boardState.completeGameCount++;
        this.gameOver(boardState);
      }
      else if ((bo.topRight) && (bo.topRight === bo.middleCenter) && (bo.topRight === bo.bottomLeft)) {
        bo.winner = bo.topRight;
        bo.boardComplete = true;
        boardState.completeGameCount++;
        this.gameOver(boardState);
      }
      else if (Object.keys(boardState[boPosition]).length === 9) {
        bo.winner = 'C';
        bo.boardComplete = true;
        boardState.completeGameCount++;
        boardState.catsCount++;
      }
    },
    togglePlayer: function togglePlayer() {
      if(this.currentPlayer === 'X'){
        this.currentPlayer = 'O';
      } else {
        this.currentPlayer = 'X';
      }
    },
    // 'innerPosition' is the section of the smaller board that was just clicked on
    whatBoardNext: function whatBoardNext(innerPosition) {
      var boardState = this.boardState;
      if (boardState[innerPosition].boardComplete) {
        this.nextBoard = false;
      } else {
        this.nextBoard = innerPosition;
      }
    },
    gameOver: function gameOver(boardState) {
      if ((boardState.topLeft.winner) && (boardState.topLeft.winner === boardState.topCenter.winner) && (boardState.topLeft.winner === boardState.topRight.winner)) {
        this.winner = boardState.topLeft.winner;
      }
      else if ((boardState.middleLeft.winner) && (boardState.middleLeft.winner === boardState.middleCenter.winner) && (boardState.middleLeft.winner === boardState.middleRight.winner)) {
        this.winner = boardState.middleLeft.winner;
      }
      else if ((boardState.bottomLeft.winner) && (boardState.bottomLeft === boardState.bottomCenter.winner) && (boardState.bottomLeft === boardState.bottomRight.winner)) {
        this.winner = boardState.bottomLeft.winner;
      }
      else if ((boardState.topLeft.winner) && (boardState.topLeft.winner === boardState.middleLeft.winner) && (boardState.topLeft.winner === boardState.bottomLeft.winner)) {
        this.winner = boardState.topLeft.winner;
      }
      else if ((boardState.topCenter.winner) && (boardState.topCenter.winner === boardState.middleCenter.winner) && (boardState.topCenter.winner === boardState.bottomCenter.winner)) {
        this.winner = boardState.topCenter.winner;
      }
      else if ((boardState.topRight.winner) && (boardState.topRight.winner === boardState.middleRight.winner) && (boardState.topRight.winner === boardState.bottomRight.winner)) {
        this.winner = boardState.topRight.winner;
      }
      else if ((boardState.topLeft.winner) && (boardState.topLeft.winner === boardState.middleCenter.winner) && (boardState.topLeft.winner === boardState.bottomRight.winner)) {
        this.winner = boardState.topLeft.winner;
      }
      else if ((boardState.topRight.winner) && (boardState.topRight.winner === boardState.middleCenter.winner) && (boardState.topRight.winner === boardState.bottomLeft.winner)) {
        this.winner = boardState.topRight.winner;
      }
      else if (boardState.completeGameCount === 9) {
        this.winner = 'C';
      }
    }
  };
}