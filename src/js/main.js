(function(io) {
  'use strict';

  var socket = io({
    transports: ['websocket']
  });

/**
 * This listens for the 'connected' event and just logs what the server says.
 */
  socket.on('connected', function handleConnection(data) {
    console.log("Connected to Server", data);
  });

/**
 * This listens for the 'game_start' event and sets the boardState var to the
 * one sent from the server.
 */
  socket.on('game_start', function handleGameStart(game) {
    console.log(game);
    boardState = game.boardState;
  });

/**
 * This listens for the 'game_update' event and runs the saveAndDisplayMove fn
 * to modify the user's board based on current game state.
 */
  socket.on('game_update', function(board) {
    // saveAndDisplayMove(board.innerPosition, board.outerPosition);
    console.log(board);
  });

/**
 * This triggers when the new game button is clicked. It hides the button and
 * emits the event 'i_want_to_play_right_meow' to the server.
 */
  $('.new-game-button').on('click', function startNewGame() {
    $('.new-game').hide();
    socket.emit("i_want_to_play_right_meow");
  });

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
    'bottomRight': {},
    'catsCount': 0
  };

  var testBoardState = {
    'topLeft': {
      boardComplete: false,
      topLeft: 'X',
      middleLeft: 'O',
      middleCenter: 'O',
      bottomLeft: 'X',
    },
    'topCenter': {
      boardComplete: false,
      topLeft: 'X',
      middleCenter: 'O',
    },
    'topRight': {
      boardComplete: false,
      middleCenter: 'X',
      middleRight: 'X',
      bottomCenter: 'O',
    },
    'middleLeft': {
      boardComplete: false,
      middleCenter: 'X',
      middleRight: 'X',
    },
    'middleCenter': {
      boardComplete: true,
      winner: 'C',
      topLeft: 'O',
      topCenter: 'X',
      topRight: 'O',
      middleLeft: 'O',
      middleCenter: 'X',
      middleRight: 'O',
      bottomLeft: 'X',
      bottomCenter: 'O',
      bottomRight: 'X',
    },
    'middleRight': {
      boardComplete: false,
      topRight: 'O',
      middleCenter: 'X',
      bottomCenter: 'O',
    },
    'bottomLeft': {
      boardComplete: false,
      topCenter: 'O',
      middleCenter: 'O',
    },
    'bottomCenter': {
      boardComplete: true,
      winner: 'X',
      topRight: 'X',
      middleCenter: 'X',
      bottomLeft: 'X',
    },
    'bottomRight': {
      boardComplete: false,
      middleCenter: 'O',
    },
    'catsCount': 0
  };


/**
 * Anytime a div is clicked this records the outerPosition and innerPosition of
 * the click and checks to see three things:
 * 1. If we have a nextboard established and the outerPosition clicked does not
 *    match the nextboard it will change the message and append an aside on the
 *    correct board for 750ms.
 * 2. If the outerPosition board is already complete it says so in the message.
 * 3. If the spot clicked is already taken it says so in the message.
 * If it get's passed these three checks then it emits a 'game_update' event and
 * sends the outerPosition and innerPosition to the server. We can call this a
 * 'move'.
 */
  $('div')
    .on('click', function markASquare() {
      var outerPosition = $(this).parent()[0].classList[1];
      var innerPosition = $(this)[0].classList[1];

      if (nextBoard && (outerPosition !== nextBoard)) {
        message('You need to play on a different board.');
        $('.nextBoard').append($('<aside>Play on this board</aside>').addClass('thisOne'));
        setTimeout(function () {
          $('.thisOne').remove();
        }, 750);
      } else if (boardState[outerPosition].boardComplete) {
        message('That game is complete. Try a different board.');
      } else if (boardState[outerPosition][innerPosition]) {
        message('Someone else already went there.');
      } else {
        console.log('sending move emit');
        socket.emit('game_update', {
          outerPosition: outerPosition,
          innerPosition: innerPosition
        });
        saveAndDisplayMove(innerPosition, outerPosition);
      }
    });


/**
 * This function needs to take in a boardstate object and render the appropriate
 * board on the screen. Up until now how did I do that? When a position was clicked,
 * I would set the innerText of the div with that class to the current player's
 * symbol.
 * How do I do it now?
 * How can I grab the appropriate div based on the info in the boardstate?
 */
  function updateBoardDisplay(boardstate) {
    var arrayOfProperties = [
      Object.getOwnPropertyNames(boardstate.topLeft),
      Object.getOwnPropertyNames(boardstate.topCenter),
      Object.getOwnPropertyNames(boardstate.topRight),
      Object.getOwnPropertyNames(boardstate.middleLeft),
      Object.getOwnPropertyNames(boardstate.middleCenter),
      Object.getOwnPropertyNames(boardstate.middleRight),
      Object.getOwnPropertyNames(boardstate.bottomLeft),
      Object.getOwnPropertyNames(boardstate.bottomCenter),
      Object.getOwnPropertyNames(boardstate.bottomRight)
    ];

    arrayOfProperties[0].unshift('topLeft');
    arrayOfProperties[1].unshift('topCenter');
    arrayOfProperties[2].unshift('topRight');
    arrayOfProperties[3].unshift('middleLeft');
    arrayOfProperties[4].unshift('middleCenter');
    arrayOfProperties[5].unshift('middleRight');
    arrayOfProperties[6].unshift('bottomLeft');
    arrayOfProperties[7].unshift('bottomCenter');
    arrayOfProperties[8].unshift('bottomRight');

    arrayOfProperties.forEach(function loopEachPropertyArray(eachPropertyArray) {
      console.log(eachPropertyArray);
      eachPropertyArray.forEach(function loopEachProperty(each, i) {
        if (i === 0) {
          return;
        }
        else if (each === 'boardComplete') {
          return;
        }
        else if (each === 'winner') {
          $('.outer.' + eachPropertyArray[0]).addClass(boardstate[eachPropertyArray[0]].winner + 'Winner');
        }
        else {
          $('.outer.' + eachPropertyArray[0]).children('.' + each)[0].innerText = boardstate[eachPropertyArray[0]][each];
        }
      });
    });


  }

  $('.test-button').on('click', function testButton() {
    updateBoardDisplay(testBoardState);
  });


  function saveAndDisplayMove(innerPosition, outerPosition) {
    var myTurn = whosTurn();
    message(currentPlayer + " plays now.");
    boardState[outerPosition][innerPosition] = myTurn;
    $('.outer.' + outerPosition).children('.' + innerPosition)[0].innerText = myTurn;

    boardWon(boardState[outerPosition], outerPosition);
    gameWon(boardState);

    whatBoardNext(innerPosition);
  }

  $('.resetButton').on('click', function resetButton() {
    playAgain();
  });

  $('.logButton').on('click', function logButton() {
    console.log(boardState);
    console.log(Object.keys(boardState.topLeft).length);
  });

  function message(messageString) {
    $('.message').text(messageString);
  }

  //'bo' is a Board Object
  //'boPosition' is the outer position of bo
  function boardWon(bo, boPosition) {
    if ((bo.topLeft) && (bo.topLeft === bo.topCenter) && (bo.topLeft === bo.topRight)) {
      bo.winner = bo.topLeft;
      bo.boardComplete = true;
    }
    else if ((bo.middleLeft) && (bo.middleLeft === bo.middleCenter) && (bo.middleLeft === bo.middleRight)) {
      bo.winner = bo.middleLeft;
      bo.boardComplete = true;
    }
    else if ((bo.bottomLeft) && (bo.bottomLeft === bo.bottomCenter) && (bo.bottomLeft === bo.bottomRight)) {
      bo.winner = bo.bottomLeft;
      bo.boardComplete = true;
    }
    else if ((bo.topLeft) && (bo.topLeft === bo.middleLeft) && (bo.topLeft === bo.bottomLeft)) {
      bo.winner = bo.topLeft;
      bo.boardComplete = true;
    }
    else if ((bo.topCenter) && (bo.topCenter === bo.middleCenter) && (bo.topCenter === bo.bottomCenter)) {
      bo.winner = bo.topCenter;
      bo.boardComplete = true;
    }
    else if ((bo.topRight) && (bo.topRight === bo.middleRight) && (bo.topRight === bo.bottomRight)) {
      bo.winner = bo.topRight;
      bo.boardComplete = true;
    }
    else if ((bo.topLeft) && (bo.topLeft === bo.middleCenter) && (bo.topLeft === bo.bottomRight)) {
      bo.winner = bo.topLeft;
      bo.boardComplete = true;
    }
    else if ((bo.topRight) && (bo.topRight === bo.middleCenter) && (bo.topRight === bo.bottomLeft)) {
      bo.winner = bo.topRight;
      bo.boardComplete = true;
    }
    else if (Object.keys(boardState[boPosition]).length === 9) {
      bo.winner = 'C';
      bo.boardComplete = true;
      boardState.catsCount++;
    }
  }

  function gameWon(bo) {
    if ((bo.topLeft.boardComplete) && (bo.topLeft.winner === bo.topCenter.winner) && (bo.topLeft.winner === bo.topRight.winner)) {
      $('.' + bo.topLeft.winner + 'WinsTheGame').show();
    }
    else if ((bo.middleLeft.boardComplete) && (bo.middleLeft.winner === bo.middleCenter.winner) && (bo.middleLeft.winner === bo.middleRight.winner)) {
      $('.' + bo.middleLeft.winner + 'WinsTheGame').show();
    }
    else if ((bo.bottomLeft.boardComplete) && (bo.bottomLeft.winner === bo.bottomCenter.winner) && (bo.bottomLeft.winner === bo.bottomRight.winner)) {
      $('.' + bo.bottomLeft.winner + 'WinsTheGame').show();
    }
    else if ((bo.topLeft.boardComplete) && (bo.topLeft.winner === bo.middleLeft.winner) && (bo.topLeft.winner === bo.bottomLeft.winner)) {
      $('.' + bo.topLeft.winner + 'WinsTheGame').show();
    }
    else if ((bo.topCenter.boardComplete) && (bo.topCenter.winner === bo.middleCenter.winner) && (bo.topCenter.winner === bo.bottomCenter.winner)) {
      $('.' + bo.topCenter.winner + 'WinsTheGame').show();
    }
    else if ((bo.topRight.boardComplete) && (bo.topRight.winner === bo.middleRight.winner) && (bo.topRight.winner === bo.bottomRight.winner)) {
      $('.' + bo.topRight.winner + 'WinsTheGame').show();
    }
    else if ((bo.topLeft.boardComplete) && (bo.topLeft.winner === bo.middleCenter.winner) && (bo.topLeft.winner === bo.bottomRight.winner)) {
      $('.' + bo.topLeft.winner + 'WinsTheGame').show();
    }
    else if ((bo.topRight.boardComplete) && (bo.topRight.winner === bo.middleCenter.winner) && (bo.topRight.winner === bo.bottomLeft.winner)) {
      $('.' + bo.topRight.winner + 'WinsTheGame').show();
    }
    else if (boardState.catsCount === 9) {
      $('.CWinsTheGame').show();
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
      $('section').addClass('nextBoard');
    } else {
      nextBoard = innerPosition;
      $('section').removeClass('nextBoard');
      $('.outer.' + innerPosition).addClass('nextBoard');
    }
  }

  function playAgain() {
    currentPlayer = 'X';
    nextBoard = false;
    boardState = {
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
    $('div').text('');
    $('.XWinsTheGame').hide().text('X');
    $('.OWinsTheGame').hide().text('O');
    $('.CWinsTheGame').hide().text('C');
    $('.XWins').text('X');
    $('.OWins').text('O');
    $('.CWins').text('C');
    $('.outer').removeClass('XWinner');
    $('.outer').removeClass('OWinner');
    $('.outer').removeClass('CWinner');
    $('section').removeClass('nextBoard');
    message('Start Again. X Plays First.');
  }

})(io);
