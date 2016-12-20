(function() {
  'use strict';

  var socket = io({
    transports: ['websocket']
  });

  socket.on('connected', function handleConnection(data) {
    console.log("Connected to Server", data);
  });

  socket.on('game_start', function handleGameStart(game) {
    console.log(game);
    boardState = game.boardState;
  })

  socket.on('game_update', function(board) {
    saveAndDisplayMove(data.innerPosition, data.outerPosition);
  })

  $('.new-game-button').on('click', function startNewGame() {
    $('.new-game').hide();
    socket.emit("i_want_to_play_right_meow");
  })

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
        socket.emit('game_update', {
          outerPosition: outerPosition,
          innerPosition: innerPosition
        })
      }
    });


  function render(game) {

  }

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
    else if (Object.keys(boardState[boPosition]).length === 9) {
      bo.winner = 'C';
      bo.boardComplete = true;
      boardState.catsCount++;
      $('.outer.' + boPosition).addClass(bo.winner + 'Winner');
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

})();
