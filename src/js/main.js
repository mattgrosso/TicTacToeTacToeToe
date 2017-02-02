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
  socket.on('connected', function handleConnection(id) {
    if (!localStorage.getItem('userID')) {
      localStorage.setItem('userID', id);
    }
    var pathComponents = window.location.pathname.split('/');
    if (pathComponents[1] === 'game' && pathComponents[2]) {
      var gameID = pathComponents[2];
      socket.emit('rejoin_game', {gameID: gameID, playerInfo: storedPlayerInfo()});
    }

    console.log('Connected to Server');
  });

/**
 * This listens for the 'game_start' event and sets the boardState var to the
 * one sent from the server.
 */
  socket.on('game_start', function handleGameStart(serverGame) {
    game = serverGame;
    history.pushState('', 'X vs O', "/game/" + game.id);
    $('.waiting-gif').hide();
    $('.game-rules-on-page').removeClass('game-rules-on-page').addClass('game-rules-sidebar').addClass('hidden-left');
    $('#register-new-player').hide();
    $ui.show();
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

  socket.on('error', function displayError(errorMessage) {
    message(errorMessage);
  });

/**
 * This triggers when the new game button is clicked. It hides the button and
 * emits the event 'i_want_to_play_right_meow' to the server.
 */
  $('#register-new-player').on('submit', function startNewGame(e) {
    e.preventDefault();
    $('#register-new-player').hide();
    $('.waiting-gif').css({
      display: 'block'
    });
    message('Waiting for a second player to join.');
    var username = $(this).find("input[name='username']").val() || "Anonymoose";
    localStorage.setItem('username', username);

    socket.emit( "i_want_to_play_right_meow", storedPlayerInfo() );
    return false;
  });

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
    if (!me()) {
      message('Spectating ' + game.players[0].username + ' vs. ' + game.players[1].username);
      return;
    }
    if (myTurn()) {
      message("Your Turn. You are " + me().symbol + ".");
    } else {
      message("Waiting for " + game.currentPlayer);
    }
  }

  function me() {
    return game.players.find(function (el) {
      return el.id === localStorage.getItem('userID');
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

    if (!me() || !myTurn()) {
      $ui.css({
        opacity: '0.5',
      });
      $ui.find('.inner').css({
        cursor: 'not-allowed'
      });
    } else {
      $ui.css({
        opacity: '1',
      });
    }

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

  $('.rules-button').on('click', function rulesButton() {
    $(this).html('<i class="fa fa-times" aria-hidden="true"></i>').attr('title', 'Close Rules');
    $('.game-rules-sidebar').toggleClass('hidden-left');
    $('.hidden-left .rules-button').html('<i class="fa fa-question-circle" aria-hidden="true"></i>').attr('title', 'Learn to Play');
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
    $('.waiting-gif').css({
      display: 'block'
    });
    message('Waiting for a second player to join.');
  }

  function storedPlayerInfo() {
    return { username: localStorage.getItem("username"), id: localStorage.getItem("userID") };
  }

})(io);
