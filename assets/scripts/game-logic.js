'use strict';

// A tray to hold value on the board
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

// sets all values of the board tray to null
let clearBoard = function(board) {
  for (let i = 0; i < board.length; i++) {
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
  if (boxVals === 'xxx' || boxVals === 'ooo') { return true; }
  else { return false; }
};

clearBoard(board);
board[0] = 'o';
board[3] = 'o';
board[7] = 'o';
let check = winCheck(lines.left, board);
console.log(check);

// Original winCheck function. Requires value to be hardcoded into tray
// Seems messy, will redo.

// let tray = [0, 1, 2, 3, 4, 5, 6, 7, 8];
// let winCheck = function(t) {
//   if (t[0] === t[1] && t[2] === t[3] || // top row
//       t[0] === t[4] && t[0] === t[8] || // diagonal TR to BL
//       t[0] === t[3] && t[0] === t[6] || // left column
//       t[1] === t[4] && t[1] === t[7] || // middle column
//       t[2] === t[4] && t[2] === t[6] || // diagonal TL to BR
//       t[2] === t[5] && t[2] === t[8] || // right column
//       t[3] === t[4] && t[3] === t[5] || // middle row
//       t[6] === t[7] && t[6] === t[8] )  // bottom row
//       { return true;
//       } else { return false; }
// }
