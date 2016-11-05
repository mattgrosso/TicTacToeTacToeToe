(function() {
  'use strict';

  var currentPlayer = 'X';
  var nextBoard = false;
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
        console.log('(nextBoard is true) and (outerPosition is not equal to nextBoard)');
      } else if (boardState[outerPosition].boardComplete) {
        console.log('(nextBoard is false or else not equal to outerPosition) AND (outerPosition board is complete)');
      } else if (boardState[outerPosition][innerPosition]) {
        console.log('Inner Board is already marked there');
      } else {
        console.log('(nextBoard is false or else not equal to outerPosition) AND (outerPosition board is not complete) AND (innerPosition is not already marked)');
        var myTurn = whosTurn();

        boardState[outerPosition][innerPosition] = myTurn;
        $('.outer.' + outerPosition).children('.' + innerPosition)[0].innerText = myTurn;
        boardWon(boardState[outerPosition], outerPosition);

        whatBoardNext(innerPosition);
      }

    });

  //'bo' is a Board Object
  //'boPosition' is the outer position of bo
  function boardWon(bo, boPosition) {
    if ((bo.topLeft) && (bo.topLeft === bo.topCenter) && (bo.topLeft === bo.topRight)) {
      bo.winner = bo.topLeft;
      bo.boardComplete = true;
      $('.outer.' + boPosition).addClass(bo.winner + 'Winner');
    }
    else if ((bo.middleLeft) && (bo.middleLeft === bo.middleCenter) && (bo.middleLeft === bo.middleRight)) {
      bo.winner = bo.middleLeft;
      bo.boardComplete = true;
      $('.outer.' + boPosition).addClass(bo.winner + 'Winner');
    }
    else if ((bo.bottomLeft) && (bo.bottomLeft === bo.bottomCenter) && (bo.bottomLeft === bo.bottomRight)) {
      bo.winner = bo.bottomLeft;
      bo.boardComplete = true;
      $('.outer.' + boPosition).addClass(bo.winner + 'Winner');
    }
    else if ((bo.topLeft) && (bo.topLeft === bo.middleLeft) && (bo.topLeft === bo.bottomLeft)) {
      bo.winner = bo.topLeft;
      bo.boardComplete = true;
      $('.outer.' + boPosition).addClass(bo.winner + 'Winner');
    }
    else if ((bo.topCenter) && (bo.topCenter === bo.middleCenter) && (bo.topCenter === bo.bottomCenter)) {
      bo.winner = bo.topCenter;
      bo.boardComplete = true;
      $('.outer.' + boPosition).addClass(bo.winner + 'Winner');
    }
    else if ((bo.topRight) && (bo.topRight === bo.middleRight) && (bo.topRight === bo.bottomRight)) {
      bo.winner = bo.topRight;
      bo.boardComplete = true;
      $('.outer.' + boPosition).addClass(bo.winner + 'Winner');
    }
    else if ((bo.topLeft) && (bo.topLeft === bo.middleCenter) && (bo.topLeft === bo.bottomRight)) {
      bo.winner = bo.topLeft;
      bo.boardComplete = true;
      $('.outer.' + boPosition).addClass(bo.winner + 'Winner');
    }
    else if ((bo.topRight) && (bo.topRight === bo.middleCenter) && (bo.topRight === bo.bottomLeft)) {
      bo.winner = bo.topRight;
      bo.boardComplete = true;
      $('.outer.' + boPosition).addClass(bo.winner + 'Winner');
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

  // 'innerPosition' is the section of the smaller board that was just clicked on
  function whatBoardNext(innerPosition) {
    if (boardState[innerPosition].boardComplete) {
      nextBoard = false;
    } else {
      nextBoard = innerPosition;
    }
  }


})();
