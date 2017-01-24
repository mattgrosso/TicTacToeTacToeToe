(function(io) {
  'use strict';

  var socket = io({
    transports: ['websocket']
  });

  var game;
  var $ui = $('#gameboard-display');

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
  socket.on('game_start', function handleGameStart(serverGame) {
    game = serverGame;
    $('.waiting-gif').hide();
    $('.resetButton').show();
    updateDisplay(game);
  });

/**
 * This listens for the 'game_update' event and runs the saveAndDisplayMove fn
 * to modify the user's board based on current game state.
 */
  socket.on('game_update', function(serverGame) {
    game = serverGame;
    updateDisplay(game);
  });

/**
 * This triggers when the new game button is clicked. It hides the button and
 * emits the event 'i_want_to_play_right_meow' to the server.
 */
  $('.new-game-button').on('click', function startNewGame() {
    $('.new-game').hide();
    $('.waiting-gif').show();
    message('Waiting for a second player to join. Look at this awesome gif.');
    socket.emit("i_want_to_play_right_meow");
  });

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
  $ui
    .on('click', 'div' ,function markASquare() {
      var outerPosition = $(this).parent()[0].classList[1];
      var innerPosition = $(this)[0].classList[1];

      // Unless it is my move.
      if (!myTurn()) {
        return;
      }

      if (game.nextBoard && (outerPosition !== game.nextBoard)) {
        message('You need to play on a different board.');
        $ui.find('.nextBoard').append($('<aside>Play on this board</aside>').addClass('thisOne'));
        setTimeout(function () {
          $ui.find('.thisOne').remove();
        }, 750);
      } else if (game.boardState[outerPosition].boardComplete) {
        message('That game is complete. Try a different board.');
      } else if (game.boardState[outerPosition][innerPosition]) {
        message('Someone else already went there.');
      } else {
        console.log('sending move emit');
        socket.emit('game_update', {
          outerPosition: outerPosition,
          innerPosition: innerPosition
        });
      }

    });

  function updateDisplay(game) {
    console.log(socket.id);
    console.log(game);
    updateBoardDisplay(game.boardState, game.winner);
    displayNextBoard(game);
    console.log(me());
    if (myTurn()) {
      message("Your Turn. You are " + me().symbol + ".");
    } else {
      message("Waiting for " + game.currentPlayer);
    }
  }

  function me() {
    return game.players.find(function (el) {
      return el.id === socket.id;
    });
  }

  function myTurn(){
    return me().symbol === game.currentPlayer;
  }

/**
 * This function needs to take in a boardstate object and render the appropriate
 * board on the screen. Up until now how did I do that? When a position was clicked,
 * I would set the innerText of the div with that class to the current player's
 * symbol.
 * How do I do it now?
 * How can I grab the appropriate div based on the info in the boardstate?
 */
  function updateBoardDisplay(boardstate, winner) {
    var template = $('#gameboard-template').clone();
    $ui.html(template.html());
    template = null;

    if (winner) {
      $ui.find('.' + winner + 'WinsTheGame').css({
        'display': 'block'
      });
      message(winner + 'wins the game!');
      return;
    }

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
          $ui.find('.outer.' + eachPropertyArray[0]).addClass(boardstate[eachPropertyArray[0]].winner + 'Winner');
        }
        else {
          $ui.find('.outer.' + eachPropertyArray[0]).children('.' + each)[0].innerText = boardstate[eachPropertyArray[0]][each];
        }
      });
    });
  }

  function displayNextBoard(game) {
    if (!game.nextBoard) {
      $ui.find('section').addClass('nextBoard');
    } else {
      $ui.find('section').removeClass('nextBoard');
      $ui.find('.outer.' + game.nextBoard).addClass('nextBoard');
    }
  }

  $('.test-button').on('click', function testButton() {
    updateBoardDisplay(testBoardState);
  });

  $('.resetButton').on('click', function resetButton() {
    playAgain();
    socket.emit("i_want_to_play_right_meow");
  });

  function message(messageString) {
    $('.message').text(messageString);
  }

  function playAgain() {
    // $('div').text('');
    $('.XWinsTheGame').hide().text('X');
    $('.OWinsTheGame').hide().text('O');
    $('.CWinsTheGame').hide().text('C');
    $ui.hide();
    // $('.XWins').text('X');
    // $('.OWins').text('O');
    // $('.CWins').text('C');
    // $('.outer').removeClass('XWinner');
    // $('.outer').removeClass('OWinner');
    // $('.outer').removeClass('CWinner');
    // $('section').removeClass('nextBoard');
    $('.new-game').hide();
    $('.resetButton').hide();
    $('.waiting-gif').show();
    message('Waiting for a second player to join. Look at this awesome gif.');
  }

})(io);
