'use strict';

// A tray to hold values on the board
let board = new Array();

// An object with the coordinates of each possible line
let lines = {
  top:    [[0,0], [1,0], [2,0]],
  midRow: [[0,1], [1,1], [2,1]],
  bottom: [[0,2], [1,2], [2,2]],
  left:   [[0,0], [0,1], [0,2]],
  midCol: [[1,0], [1,1], [1,2]],
  right:  [[2,0], [2,1], [2,2]],
  tl2br:  [[0,0], [1,1], [2,2]],
  bl2tr:  [[0,2], [1,1], [2,0]],
};

// An array containing the possible lines for each tray position
let linesForSquare = [
  ['top', 'left', 'tl2br'],               // 0
  ['top', 'midCol'],                      // 1
  ['top', 'right', 'bl2tr'],              // 2
  ['left', 'midRow'],                     // 3
  ['midRow', 'midCol', 'tl2br', 'bl2tr'], // 4
  ['midRow', 'right'],                    // 5
  ['bottom', 'left', 'bl2tr'],            // 6
  ['bottom', 'midCol'],                   // 7
  ['bottom', 'right', 'tl2br'],           // 8
];

// sets all values of the board tray to null
let clearBoard = function(board) {
  for (let i = 0; i < 9; i++) {
    board[i] = null;
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

// Sets value of a square
let setSquare = function(index, player, board) {
  board[index] = player;
  return;
};
