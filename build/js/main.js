(function() {
  'use strict';

  var currentPlayer = 'X';

  var boardState = {
    'top-left': {
      'top-left': null,
      'top-center': null,
      'top-right': null,
      'middle-left': null,
      'middle-center': null,
      'middle-right': null,
      'bottom-left': null,
      'bottom-center': null,
      'bottom-right': null
    },
    'top-center': {
      'top-left': null,
      'top-center': null,
      'top-right': null,
      'middle-left': null,
      'middle-center': null,
      'middle-right': null,
      'bottom-left': null,
      'bottom-center': null,
      'bottom-right': null
    },
    'top-right': {
      'top-left': null,
      'top-center': null,
      'top-right': null,
      'middle-left': null,
      'middle-center': null,
      'middle-right': null,
      'bottom-left': null,
      'bottom-center': null,
      'bottom-right': null
    },
    'middle-left': {
      'top-left': null,
      'top-center': null,
      'top-right': null,
      'middle-left': null,
      'middle-center': null,
      'middle-right': null,
      'bottom-left': null,
      'bottom-center': null,
      'bottom-right': null
    },
    'middle-center': {
      'top-left': null,
      'top-center': null,
      'top-right': null,
      'middle-left': null,
      'middle-center': null,
      'middle-right': null,
      'bottom-left': null,
      'bottom-center': null,
      'bottom-right': null
    },
    'middle-right': {
      'top-left': null,
      'top-center': null,
      'top-right': null,
      'middle-left': null,
      'middle-center': null,
      'middle-right': null,
      'bottom-left': null,
      'bottom-center': null,
      'bottom-right': null
    },
    'bottom-left': {
      'top-left': null,
      'top-center': null,
      'top-right': null,
      'middle-left': null,
      'middle-center': null,
      'middle-right': null,
      'bottom-left': null,
      'bottom-center': null,
      'bottom-right': null
    },
    'bottom-center': {
      'top-left': null,
      'top-center': null,
      'top-right': null,
      'middle-left': null,
      'middle-center': null,
      'middle-right': null,
      'bottom-left': null,
      'bottom-center': null,
      'bottom-right': null
    },
    'bottom-right': {
      'top-left': null,
      'top-center': null,
      'top-right': null,
      'middle-left': null,
      'middle-center': null,
      'middle-right': null,
      'bottom-left': null,
      'bottom-center': null,
      'bottom-right': null
    }
  };

  function whosTurn() {
    if(currentPlayer === 'X'){
      currentPlayer = 'O';
      return 'X';
    } else {
      currentPlayer = 'X';
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
