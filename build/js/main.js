(function() {
  'use strict';

  var currentPlayer = 'X';

  var boardState = {
    'topLeft': {
      'topLeft': null,
      'topCenter': null,
      'topRight': null,
      'middleLeft': null,
      'middleCenter': null,
      'middleRight': null,
      'bottomLeft': null,
      'bottomCenter': null,
      'bottomRight': null
    },
    'topCenter': {
      'topLeft': null,
      'topCenter': null,
      'topRight': null,
      'middleLeft': null,
      'middleCenter': null,
      'middleRight': null,
      'bottomLeft': null,
      'bottomCenter': null,
      'bottomRight': null
    },
    'topRight': {
      'topLeft': null,
      'topCenter': null,
      'topRight': null,
      'middleLeft': null,
      'middleCenter': null,
      'middleRight': null,
      'bottomLeft': null,
      'bottomCenter': null,
      'bottomRight': null
    },
    'middleLeft': {
      'topLeft': null,
      'topCenter': null,
      'topRight': null,
      'middleLeft': null,
      'middleCenter': null,
      'middleRight': null,
      'bottomLeft': null,
      'bottomCenter': null,
      'bottomRight': null
    },
    'middleCenter': {
      'topLeft': null,
      'topCenter': null,
      'topRight': null,
      'middleLeft': null,
      'middleCenter': null,
      'middleRight': null,
      'bottomLeft': null,
      'bottomCenter': null,
      'bottomRight': null
    },
    'middleRight': {
      'topLeft': null,
      'topCenter': null,
      'topRight': null,
      'middleLeft': null,
      'middleCenter': null,
      'middleRight': null,
      'bottomLeft': null,
      'bottomCenter': null,
      'bottomRight': null
    },
    'bottomLeft': {
      'topLeft': null,
      'topCenter': null,
      'topRight': null,
      'middleLeft': null,
      'middleCenter': null,
      'middleRight': null,
      'bottomLeft': null,
      'bottomCenter': null,
      'bottomRight': null
    },
    'bottomCenter': {
      'topLeft': null,
      'topCenter': null,
      'topRight': null,
      'middleLeft': null,
      'middleCenter': null,
      'middleRight': null,
      'bottomLeft': null,
      'bottomCenter': null,
      'bottomRight': null
    },
    'bottomRight': {
      'topLeft': null,
      'topCenter': null,
      'topRight': null,
      'middleLeft': null,
      'middleCenter': null,
      'middleRight': null,
      'bottomLeft': null,
      'bottomCenter': null,
      'bottomRight': null
    }
  };

  //'bo' is a Board Object
  function boardWon(bo) {
    if ((bo.topLeft === bo.topCenter) && (bo.topLeft === bo.topRight)) {
      bo.winner = bo.topLeft;
      return bo.winner;
    } else if (bo.middleLeft && bo.middleCenter && bo.middleRight) {
      return 'win!';
    } else if (bo.bottomLeft && bo.bottomCenter && bo.bottomRight) {
      return 'win!';
    } else if (bo.topLeft && bo.middleLeft && bo.bottomLeft) {
      return 'win!';
    } else if (bo.topCenter && bo.middleCenter && bo.bottomCenter) {
      return 'win!';
    } else if (bo.topRight && bo.middleRight && bo.bottomRight) {
      return 'win!';
    } else if (bo.topLeft && bo.middleCenter && bo.bottomRight) {
      return 'win!';
    } else if (bo.bottomLeft && bo.middleCenter && bo.topRight) {
      return 'win!';
    }
  }

  function whosTurn() {
    if(currentPlayer === true){
      currentPlayer = false;
      return 'X';
    } else {
      currentPlayer = true;
      return 'O';
    }
  }

  $('div')
    .on('click', function markASquare() {
      var outerPosition = $(this).parent()[0].classList[1];
      var innerPosition = $(this)[0].classList[1];
      var myTurn = whosTurn();

      boardState[outerPosition][innerPosition] = myTurn;
      $('.outer.' + outerPosition).children('.' + innerPosition)[0].innerText = myTurn;


    });

})();
