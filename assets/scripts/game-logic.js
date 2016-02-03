'use strict';

let gameState = {
  player: '',
  over: false,
  turn: 0,
  game: 0,

  changePlayer: function() {
    if (!this.player || this.player === 'o') { this.player = 'x';
    } else { this.player = 'o'; }
    return;
  },
};

let score = {
    x: 0,
    y: 0,
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

// sets all values of the board tray to null
let clearBoard = function(board) {
  for (let i = 0; i < 9; i++) {
    board[i] = '';
  }
  $('.game-box').children().html("");
  return;
};

// checks if a win has occurred on a given line
let winCheck = function(coordArray, board) {
  let boxVals = [];

  // concatenates values at given board coordinates
  coordArray.forEach(function(val, index) {
    boxVals.push(board[(coordArray[index][1] * 3) + coordArray[index][0]]);
  });

  // returns true if a line has been completed by either player
  // !! WILL PROBABLY NOT NEED TO CHECK FOR BOTH PLAYERS !!
  if (boxVals[0] === boxVals[1] && boxVals[0] === boxVals[2]) { return true; }
  else { return false; }
};

// Sets value of a square, then checks to see whether the move results in a win
let setSquare = function(index, gameState, board) {
  board[index] = gameState.player;
  console.log(board);
                    // "linesForSquare[index]" is an array of strings, which
                    // corrrespond to keys in the "lines" object
  for (let i = 0; i < linesForSquare[index].length; i++) {
                // for each key in "linesForSquare[index]", checks coordinates
                //  stored in "lines" object to see if the game is won
    if (winCheck( lines[linesForSquare[index][i]], board) ) {
      // alert(gameState.player + ' wins!')
      newGame(gameState, board);
      return true;
    }
  }
  gameState.changePlayer();
  return false;
};

// clears the board, sets the player based on the game count, and increments
// the game count
let newGame = function(gameState, board) {
  clearBoard(board);
  if (gameState.game % 2 === 0) { gameState.player = 'x'; }
  else { gameState.player = 'o'; }
  gameState.game++;
  return;
};

$(document).ready(() => {
  newGame(gameState, board);
  $('.game-box').children().on('click', function() {
    let move = event.target.id;
    $(this).html(gameState.player);
    if (!board[move]) {
      gameState.over = setSquare(move, gameState, board);
    }
  });
});
