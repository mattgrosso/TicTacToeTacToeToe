(function() {
  'use strict';

  var currentPlayer = 'X';
  var nextBoard;
  var boardState = {
    'topLeft': {},
    'topCenter': {},
    'topRight': {},
    'middleLeft': {},
    'middleCenter': {},
    'middleRight': {},
    'bottomLeft': {},
    'bottomCenter': {},
    'bottomRight': {}
  };

  $('div')
    .on('click', function markASquare() {
      var outerPosition = $(this).parent()[0].classList[1];
      var innerPosition = $(this)[0].classList[1];

      if (nextBoard && (outerPosition !== nextBoard)) {
        console.log('try again');
      } else if (boardState[outerPosition][innerPosition]) {
        console.log('try again');
      } else {
        var myTurn = whosTurn();

        boardState[outerPosition][innerPosition] = myTurn;
        $('.outer.' + outerPosition).children('.' + innerPosition)[0].innerText = myTurn;
        boardWon(boardState[outerPosition]);
        nextBoard = innerPosition;

        console.log();
        console.log('next move must be in ', innerPosition);
      }

    });

    //'bo' is a Board Object
    function boardWon(bo) {
      if ((bo.topLeft) && (bo.topLeft === bo.topCenter) && (bo.topLeft === bo.topRight)) {
        bo.winner = bo.topLeft;
        bo.boardComplete = true;
        console.log('We have a winner. It is ', bo.winner);
        return bo.winner;
      }
      else if ((bo.middleLeft) && (bo.middleLeft === bo.middleCenter) && (bo.middleLeft === bo.middleRight)) {
        bo.winner = bo.middleLeft;
        bo.boardComplete = true;
        console.log('We have a winner. It is ', bo.winner);
        return bo.winner;
      }
      else if ((bo.bottomLeft) && (bo.bottomLeft === bo.bottomCenter) && (bo.bottomLeft === bo.bottomRight)) {
        bo.winner = bo.bottomLeft;
        bo.boardComplete = true;
        console.log('We have a winner. It is ', bo.winner);
        return bo.winner;
      }
      else if ((bo.topLeft) && (bo.topLeft === bo.middleLeft) && (bo.topLeft === bo.bottomLeft)) {
        bo.winner = bo.topLeft;
        bo.boardComplete = true;
        console.log('We have a winner. It is ', bo.winner);
        return bo.winner;
      }
      else if ((bo.topCenter) && (bo.topCenter === bo.middleCenter) && (bo.topCenter === bo.bottomCenter)) {
        bo.winner = bo.topCenter;
        bo.boardComplete = true;
        console.log('We have a winner. It is ', bo.winner);
        return bo.winner;
      }
      else if ((bo.topRight) && (bo.topRight === bo.middleRight) && (bo.topRight === bo.bottomRight)) {
        bo.winner = bo.topRight;
        bo.boardComplete = true;
        console.log('We have a winner. It is ', bo.winner);
        return bo.winner;
      }
      else if ((bo.topLeft) && (bo.topLeft === bo.middleCenter) && (bo.topLeft === bo.bottomRight)) {
        bo.winner = bo.topLeft;
        bo.boardComplete = true;
        console.log('We have a winner. It is ', bo.winner);
        return bo.winner;
      }
      else if ((bo.topRight) && (bo.topRight === bo.middleCenter) && (bo.topRight === bo.bottomLeft)) {
        bo.winner = bo.topRight;
        bo.boardComplete = true;
        console.log('We have a winner. It is ', bo.winner);
        return bo.winner;
      }
    }

    function whosTurn() {
      if(currentPlayer === 'X'){
        currentPlayer = 'O';
        return 'X';
      } else {
        currentPlayer = 'X';
        return 'O';
      }
    }

})();
