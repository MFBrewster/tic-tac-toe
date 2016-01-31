'use strict';

let board = [0,1,2,3,4,5,6,7,8];

let clearBoard = function(board) {
  for (let i = 0; i < board.length; i++) {
    board[i] = null;
  }
  return;
}

clearBoard(board);

console.log(board);

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
