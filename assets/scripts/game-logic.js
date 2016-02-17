'use strict';

let apiState = {
  modalOpen: false,
  signedIn: false,
};

// All variable stored in a single object
let gamestate = {
  player: '',
  cells: [],
  over: false,
  turn: 0,
  game: 0,
  move: NaN,
  id: NaN,

  score: {
      x: 0,
      o: 0,
      tie: 0,

      resetScore: function() {
        this.x = 0;
        this.o = 0;
        this.tie = 0;
      },
  },

  // Method to toggle player
  changePlayer: function() {
    if (!this.player || this.player === 'o') { this.player = 'x';
    } else { this.player = 'o'; }
    return;
  },
};

let board = [];

const myApp = {
  baseUrl: "http://tic-tac-toe.wdibos.com",
};

// An object with the coordinates of each possible line
let lines = {
  top:      [[0,0], [1,0], [2,0]],
  midRow:   [[0,1], [1,1], [2,1]],
  bottom:   [[0,2], [1,2], [2,2]],
  left:     [[0,0], [0,1], [0,2]],
  midCol:   [[1,0], [1,1], [1,2]],
  right:    [[2,0], [2,1], [2,2]],
  diagDown: [[0,0], [1,1], [2,2]],
  diagUp:   [[0,2], [1,1], [2,0]],
};

// An array containing the possible lines for each tray position
let linesForSquare = [
  ['top', 'left', 'diagDown'],                // 0
  ['top', 'midCol'],                          // 1
  ['top', 'right', 'diagUp'],                 // 2
  ['left', 'midRow'],                         // 3
  ['midRow', 'midCol', 'diagDown', 'diagUp'], // 4
  ['midRow', 'right'],                        // 5
  ['bottom', 'left', 'diagUp'],               // 6
  ['bottom', 'midCol'],                       // 7
  ['bottom', 'right', 'diagDown'],            // 8
];

// sets all values of the board tray to null...
let clearBoard = function(gamestate) {
  for (let i = 0; i < 9; i++) {
    gamestate.cells[i] = '';
  }
  // ... and clears the HTML board
  $('.game-box').children().html("");
  return;
};

// Updates the score box displays
let displayScore = function(score) {
  $('#x .score').html(score.x);
  $('#o .score').html(score.o);
  $('#tie .score').html(score.tie);
};

// checks if a win has occurred on a given line
let winCheck = function(coordArray, board) {
  let boxVals = [];

  // Creates an array of values located at coordinate positions
  coordArray.forEach(function(val, index) {
    boxVals.push(board[(coordArray[index][1] * 3) + coordArray[index][0]]);
  });

  // returns true if all values stored in the array are equivalent
  if (boxVals[0] === boxVals[1] && boxVals[0] === boxVals[2]) { return true; }
  else { return false; }
};

let returnWinner = function(board, over) {
  if (!over) { return 'Not Over'; }

  let allLines = [
    [0,0], [1,0], [2,0],
    [0,1], [1,1], [2,1],
    [0,2], [1,2], [2,2],
    [0,0], [0,1], [0,2],
    [1,0], [1,1], [1,2],
    [2,0], [2,1], [2,2],
    [0,0], [1,1], [2,2],
    [0,2], [1,1], [2,0],
  ];

  let counter = 0;

  for (let i = 0; i < lines.length; i++) {
    if (winCheck(lines[i], board)) {
      return board[(allLines[counter][0][1] * 3) + allLines[counter][0][0]];
    } else { counter++; }
  }
  return 'Tie';
};

let updateFromGameToApi = function(gamestate) {
  let formData = new FormData();

  formData.append("game[cell][index]", gamestate.move);
  formData.append("game[cell][value]", gamestate.player);
  formData.append("game[over]", gamestate.over);

  $.ajax({

    url: myApp.baseUrl + '/games/' + myApp.data.game.id,
    method: 'PATCH',
    headers: {
      Authorization: 'Token token=' + myApp.user.token,
    },
    contentType: false,
    processData: false,
    data: formData,
  }).done(function(data) {
    console.log(data);
  }).fail(function(jqxhr) {
    console.error(jqxhr);
  });
};

let winMessage = function(gamestate, isWin) {
  let messageText = '';

  if (isWin) { messageText = gamestate.player + ' wins!'; }
  else { messageText = 'Cat\'s Game!'; }

  $('#win-message').html(messageText);
  $('#win-message').show();
  return;
};

// Adds point to score of current player if a player won; otherwise adds a point
// to the score for "tie". Increments gamecounter, sets "gamestate.over" to
// true, and updates the score display
let endGame = function(gamestate, playerWin) {
  playerWin ?  gamestate.score[gamestate.player]++ : gamestate.score.tie++;

  winMessage(gamestate, playerWin);

  gamestate.game++;
  gamestate.over = true;
  if (apiState.signedIn) {
    updateFromGameToApi(gamestate);
  }
  displayScore(gamestate.score);
  return;
};

let createGameApi = function() {
  $.ajax({

    url: myApp.baseUrl + '/games',
    method: 'POST',
    headers: {
      Authorization: 'Token token=' + myApp.user.token,
    },
    contentType: false,
    processData: false,
    data: new FormData(),
  }).done(function(data, gamestate) {
    console.log(data);
  }).fail(function(jqxhr) {
    console.error(jqxhr);
  });
};

// clears the board, sets the player based on the game count, resets the turn
// count,and increments the game count
let newGame = function(gamestate) {
  clearBoard(gamestate);
  $('#win-message').hide();
  displayScore(gamestate.score);
  if (gamestate.game % 2 === 0) { gamestate.player = 'x'; }
  else { gamestate.player = 'o'; }
  gamestate.over = false;
  gamestate.turn = 0;

  if (apiState.signedIn) {
    createGameApi();
  }
  return;
};

// Sets value of a square, then checks to see whether the move results in a win.
// If a player makes a winning move, or nine turns have passed without a win,
// the game ends.
let setSquare = function(gamestate) {
  gamestate.cells[gamestate.move] = gamestate.player;
                    // "linesForSquare[index]" is an array of strings, which
                    // corrrespond to keys in the "lines" object
  for (let i = 0; i < linesForSquare[gamestate.move].length; i++) {
                // for each key in "linesForSquare[index]", checks coordinates
                //  stored in "lines" object to see if the game is won
    if (winCheck( lines[linesForSquare[gamestate.move][i]], gamestate.cells) ) {
      endGame(gamestate, true);
      return true;
    }
  }

  // If statement which either increments the turn
  // counter, or ends the game in a tie
  if (gamestate.turn < 8) {
    gamestate.turn++;
  } else {
    endGame(gamestate, false);
  }
  //

  // if the game doesn't end, toggles player
  gamestate.changePlayer();
  return false;
};

let listGames = function() {
  $.ajax({
    url: myApp.baseUrl + '/games',
    type: 'GET',
    headers: {
      Authorization: 'Token token=' + myApp.user.token,
    },
  }).done(function(data) {
    console.log(data);
    let htmlInsert = '';
    for (let i = 0; i < data.games.length; i++) {
      htmlInsert += `<li id="" class="one-game">Game ID: ${data.games[i].id},
                    winner: ${returnWinner(data.games[i].cells, data.games[i].over)},
                    <br>player x: ${data.games[i].player_x.email}<br>
                    player o: ${data.games[i].player_o ? data.games[i].player_o.email : 'none'}</li>`;
    }

    $('.games-list').html(htmlInsert);
  }).fail(function(data) {
    console.error(data);
  });
};

// On page load, sets up the board and sets event listeners
$(document).ready(() => {
  newGame(gamestate);
  $('.bigDiv').hide();
  $('#win-message').hide();


  // IMPORTANT
  // Recieves click input from user on board
  $('.game-box').children().on('click', function() {
    // hides open windows
    $('.bigDiv').hide();
    apiState.modalOpen = false;
    // if the position on the board is empty, and the gamestate.over variable
    // is not set to true, the board display indicated the move and the game
    // setSquare variable checks the win conditions
    if (!gamestate.cells[event.target.id] && !gamestate.over) {
      $(this).html(gamestate.player);
      gamestate.move = event.target.id;
      gamestate.over = setSquare(gamestate, board);
    }

    if (apiState.signedIn) { updateFromGameToApi(gamestate); }
  });

  // When the new-game button is clicked, the player is toggled before the
  // newGame function is called. This is so, if the button is pressed before
  // the game ends and the game counter is incremented, the same player
  // who started the current game will start the next one
  $('#new-game').on('click', function() {
    if (!apiState.modalOpen) {
      gamestate.changePlayer();
      newGame(gamestate, board);
    }
  });

  $('#sign-up-button').on('click', function() {
    if (!apiState.modalOpen) {
      $('.sign-up.bigDiv').show();
      apiState.modalOpen = true;
    }
  });

  $('#sign-in-button').on('click', function() {
    if (!apiState.modalOpen) {
      $('.sign-in.bigDiv').show();
      apiState.modalOpen = true;
    }
  });

  $('#change-password-button').on('click', function() {
  // for some reason this if statement doesn't work if I include the commented code
    if (!apiState.modalOpen/* && !apiState.signedIn*/) {
      $('.change-password.bigDiv').show();
      apiState.modalOpen = true;
    }
  });

  $('#my-games-button').on('click', function() {
    if (!apiState.modalOpen && apiState.signedIn) {
      $('.games-label').html(myApp.user.email + "'s Games");
      listGames();
      $('.my-games.bigDiv').show();
      apiState.modalOpen = true;
    }
  });

  $(document).keyup(function(e) {
       if (e.keyCode === 27) {
         $('.bigDiv').hide();
         apiState.modalOpen = false;
      }
  });

  $('#sign-up').on('submit', function(e) {

    e.preventDefault();

    var formData = new FormData(e.target);

    $.ajax({

      url: myApp.baseUrl + '/sign-up',
      // url: 'http://httpbin.org/post',
      method: 'POST',
      contentType: false,
      processData: false,
      data: formData,

    }).done(function(data) {
      console.log(data);
      $('.form-field').val('');
      $('.bigDiv').hide();
      apiState.modalOpen = false;
    }).fail(function(jqxhr) {
      console.error(jqxhr);
      $('.form-field').val('');
    });
  });

  $('#sign-in').on('submit', function(e) {

    e.preventDefault();

    var formData = new FormData(e.target);

    $.ajax({

      url: myApp.baseUrl + '/sign-in',
      method: 'POST',
      contentType: false,
      processData: false,
      data: formData,

    }).done(function(data) {
      myApp.user = data.user;
      console.log(data);
      $('.form-field').val('');
      $('.bigDiv').hide();
      apiState.signedIn = true;
      apiState.modalOpen = false;
      newGame(gamestate, board);
      $('.user-name').html("Signed in as " + myApp.user.email);
    }).fail(function(jqxhr) {
      console.error(jqxhr);
      $('.form-field').val('');
    });
  });

  $('#change-password').on('submit', function(e) {
    e.preventDefault();
    if (!myApp.user) {
      console.error('Wrong!');
      return;
    }

    var formData = new FormData(e.target);

    $.ajax({

      url: myApp.baseUrl + '/change-password/' + myApp.user.id,
      method: 'PATCH',
      headers: {
        Authorization: 'Token token=' + myApp.user.token,
      },
      contentType: false,
      processData: false,
      data: formData,
    }).done(function(data) {
      console.log(data);
      $('.form-field').val('');
      $('.bigDiv').hide();
      apiState.modalOpen = false;
    }).fail(function(jqxhr) {
      console.error(jqxhr);
      $('.form-field').val('');
    });
  });

  $('#sign-out-button').on('click', function() {
    if (!myApp.user) {
      console.error('Wrong!');
      return;
    }

    $.ajax({
      url: myApp.baseUrl + '/sign-out/' + myApp.user.id,
      method: 'DELETE',
      headers: {
        Authorization: 'Token token=' + myApp.user.token,
      }
    }).done(function(data) {
      console.log(data);
      apiState.signedIn = false;
      newGame(gamestate, board);
      $('.user-name').html("");
    }).fail(function(data) {
      console.error(data);
    });
  });
});
