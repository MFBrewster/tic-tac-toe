'use strict';

let gameState = {
  player: '',
  xScore: 0,
  yScore: 0,
  over: false,
  turn: 0,
  game: 0,
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
  return;
};

// checks if a win has occurred on a given line
let winCheck = function(coordArray, board) {
  let boxVals = '';

  // concatenates values at given board coordinates
  coordArray.forEach(function(val, index) {
    boxVals += board[(coordArray[index][1] * 3) + coordArray[index][0]];
  });

  // returns true if a line has been completed by either player
  // !! WILL PROBABLY NOT NEED TO CHECK FOR BOTH PLAYERS !!
  if (boxVals === 'xxx' || boxVals === 'ooo') { return true; }
  else { return false; }
};

// Sets value of a square, then checks to see whether the move results in a win
let setSquare = function(index, player, board) {
  board[index] = player;
                    // "linesForSquare[index]" is an array of strings, which
                    // corrrespond to keys in the "lines" object
  for (let i = 0; i < linesForSquare[index].length; i++) {
                // for each key in "linesForSquare[index]", checks coordinates
                //  stored in "lines" object to see if the game is won
    if (winCheck( lines[linesForSquare[index][i]], board) ) { return true; }
  }
  return false;
};

let newGame = function(gameState, board) {
  clearBoard(board);
  gameState.player = 'x';
  // if (game % 2 === 0) { player = 'x'; }
  // else { player = 'o'; }
  gameState.game++;
  return;
};

console.log(gameState, board);
newGame(gameState, board);
console.log(gameState, board);
