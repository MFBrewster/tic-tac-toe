'use strict';

// All variable stored in a single object
let gameState = {
  player: '',
  over: false,
  turn: 0,
  game: 0,

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
let clearBoard = function(board) {
  for (let i = 0; i < 9; i++) {
    board[i] = '';
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

// Adds point to score of current player if a player won; otherwise adds a point
// to the score for "tie". Increments gamecounter, sets "gameState.over" to
// true, and updates the score display
let endGame = function(gameState, playerWin) {
  if (playerWin) {
    gameState.score[gameState.player]++;
  } else {
    gameState.score.tie++;
  }
  gameState.game++;
  gameState.over = true;
  displayScore(gameState.score);
  return;
};

// clears the board, sets the player based on the game count, resets the turn
// count,and increments the game count
let newGame = function(gameState, board) {
  clearBoard(board);
  displayScore(gameState.score);
  if (gameState.game % 2 === 0) { gameState.player = 'x'; }
  else { gameState.player = 'o'; }
  gameState.over = false;
  gameState.turn = 0;
  return;
};

// Sets value of a square, then checks to see whether the move results in a win.
// If a player makes a winning move, or nine turns have passed without a win,
// the game ends.
let setSquare = function(index, gameState, board) {
  board[index] = gameState.player;
                    // "linesForSquare[index]" is an array of strings, which
                    // corrrespond to keys in the "lines" object
  for (let i = 0; i < linesForSquare[index].length; i++) {
                // for each key in "linesForSquare[index]", checks coordinates
                //  stored in "lines" object to see if the game is won
    if (winCheck( lines[linesForSquare[index][i]], board) ) {
      endGame(gameState, true);
      return true;
    }
  }

  // If statement which either increments the turn
  // counter, or ends the game in a tie
  if (gameState.turn < 8) {
    gameState.turn++;
  } else {
    endGame(gameState, false);
  }

  // if the game doesn't end, toggles player
  gameState.changePlayer();
  return false;
};

// On page load, sets up the board and sets event listeners
$(document).ready(() => {
  newGame(gameState, board);

  // If any of the squares on the game board are clicked...
  $('.game-box').children().on('click', function() {
    // "move" is set to a value on the board from 0-8
    let move = event.target.id;
    // if the position on the board is empty, and the gameState.over variable
    // is not set to true, the board display indicated the move and the game
    // setSquare variable checks the win conditions
    if (!board[move] && !gameState.over) {
      $(this).html(gameState.player);
      gameState.over = setSquare(move, gameState, board);
    }
  });

  // When the new-game button is clicked, the player is toggled before the
  // newGame function is called. This is so, if the button is pressed before
  // the game ends and the game counter is incremented, the same player
  // who started the current game will start the next one
  $('#new-game').on('click', function() {
    gameState.changePlayer();
    newGame(gameState, board);
  });

  $('.sign-up-div').hide();
});
