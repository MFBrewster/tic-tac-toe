webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// user require with a reference to bundle the file and use it in this file
	// var example = require('./example');

	// load manifests

	__webpack_require__(1);
	__webpack_require__(5);

	// attach jQuery globally
	__webpack_require__(9);
	__webpack_require__(10);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// user require with a reference to bundle the file and use it in this file
	// var example = require('./example');

	// use require without a reference to ensure a file is bundled

	__webpack_require__(2);

	// load javascript file with game logic
	__webpack_require__(3);

	// load sass manifest
	__webpack_require__(5);

	// $(document).ready(() => {
	//
	// });

/***/ },
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var apiState = {
	  modalOpen: false,
	  signedIn: false
	};

	// All variable stored in a single object
	var gamestate = {
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

	    resetScore: function resetScore() {
	      this.x = 0;
	      this.o = 0;
	      this.tie = 0;
	    }
	  },

	  // Method to toggle player
	  changePlayer: function changePlayer() {
	    if (!this.player || this.player === 'o') {
	      this.player = 'x';
	    } else {
	      this.player = 'o';
	    }
	    return;
	  }
	};

	var board = [];

	var myApp = {
	  baseUrl: "http://tic-tac-toe.wdibos.com"
	};

	// An object with the coordinates of each possible line
	var lines = {
	  top: [[0, 0], [1, 0], [2, 0]],
	  midRow: [[0, 1], [1, 1], [2, 1]],
	  bottom: [[0, 2], [1, 2], [2, 2]],
	  left: [[0, 0], [0, 1], [0, 2]],
	  midCol: [[1, 0], [1, 1], [1, 2]],
	  right: [[2, 0], [2, 1], [2, 2]],
	  diagDown: [[0, 0], [1, 1], [2, 2]],
	  diagUp: [[0, 2], [1, 1], [2, 0]]
	};

	// An array containing the possible lines for each tray position
	var linesForSquare = [['top', 'left', 'diagDown'], // 0
	['top', 'midCol'], // 1
	['top', 'right', 'diagUp'], // 2
	['left', 'midRow'], // 3
	['midRow', 'midCol', 'diagDown', 'diagUp'], // 4
	['midRow', 'right'], // 5
	['bottom', 'left', 'diagUp'], // 6
	['bottom', 'midCol'], // 7
	['bottom', 'right', 'diagDown']];

	// sets all values of the board tray to null...
	// 8
	var clearBoard = function clearBoard(gamestate) {
	  for (var i = 0; i < 9; i++) {
	    gamestate.cells[i] = '';
	  }
	  // ... and clears the HTML board
	  $('.game-box').children().html("");
	  return;
	};

	// Updates the score box displays
	var displayScore = function displayScore(score) {
	  $('#x .score').html(score.x);
	  $('#o .score').html(score.o);
	  $('#tie .score').html(score.tie);
	};

	// checks if a win has occurred on a given line
	var winCheck = function winCheck(coordArray, board) {
	  var boxVals = [];

	  // Creates an array of values located at coordinate positions
	  coordArray.forEach(function (val, index) {
	    boxVals.push(board[coordArray[index][1] * 3 + coordArray[index][0]]);
	  });

	  // returns true if all values stored in the array are equivalent
	  if (boxVals[0] === boxVals[1] && boxVals[0] === boxVals[2]) {
	    return true;
	  } else {
	    return false;
	  }
	};

	var returnWinner = function returnWinner(board, over) {
	  if (!over) {
	    return 'Not Over';
	  }

	  var allLines = [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2], [0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2], [0, 0], [1, 1], [2, 2], [0, 2], [1, 1], [2, 0]];

	  var counter = 0;

	  for (var i = 0; i < lines.length; i++) {
	    if (winCheck(lines[i], board)) {
	      return board[allLines[counter][0][1] * 3 + allLines[counter][0][0]];
	    } else {
	      counter++;
	    }
	  }
	  return 'Tie';
	};

	var updateFromGameToApi = function updateFromGameToApi(gamestate) {
	  var formData = new FormData();

	  formData.append("game[cell][index]", gamestate.move);
	  formData.append("game[cell][value]", gamestate.player);
	  formData.append("game[over]", gamestate.over);

	  $.ajax({

	    url: myApp.baseUrl + '/games/' + myApp.id,
	    method: 'PATCH',
	    headers: {
	      Authorization: 'Token token=' + myApp.user.token
	    },
	    contentType: false,
	    processData: false,
	    data: formData
	  }).done(function (data) {
	    console.log("Updated Successfully!");
	    console.log(gamestate);
	    console.log(data);
	  }).fail(function (jqxhr) {
	    console.error(jqxhr);
	  });
	};

	var winMessage = function winMessage(gamestate, isWin) {
	  var messageText = '';

	  if (isWin) {
	    messageText = gamestate.player + ' wins!';
	  } else {
	    messageText = 'Cat\'s Game!';
	  }

	  $('#win-message').html(messageText);
	  $('#win-message').show();
	  return;
	};

	// Adds point to score of current player if a player won; otherwise adds a point
	// to the score for "tie". Increments gamecounter, sets "gamestate.over" to
	// true, and updates the score display
	var endGame = function endGame(gamestate, playerWin) {
	  playerWin ? gamestate.score[gamestate.player]++ : gamestate.score.tie++;

	  winMessage(gamestate, playerWin);
	  displayScore(gamestate.score);

	  gamestate.game++;
	  gamestate.over = true;
	  return;
	};

	var createGameApi = function createGameApi() {
	  $.ajax({

	    url: myApp.baseUrl + '/games',
	    method: 'POST',
	    headers: {
	      Authorization: 'Token token=' + myApp.user.token
	    },
	    contentType: false,
	    processData: false,
	    data: new FormData()
	  }).done(function (data) {
	    myApp.id = data.game.id;
	    console.log(data);
	  }).fail(function (jqxhr) {
	    console.error(jqxhr);
	  });
	};

	// clears the board, sets the player based on the game count, resets the turn
	// count,and increments the game count
	var newGame = function newGame(gamestate) {
	  clearBoard(gamestate);
	  $('#win-message').hide();
	  displayScore(gamestate.score);
	  if (gamestate.game % 2 === 0) {
	    gamestate.player = 'x';
	  } else {
	    gamestate.player = 'o';
	  }
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
	var setSquare = function setSquare(gamestate) {
	  gamestate.cells[gamestate.move] = gamestate.player;
	  // "linesForSquare[index]" is an array of strings, which
	  // corrrespond to keys in the "lines" object
	  for (var i = 0; i < linesForSquare[gamestate.move].length; i++) {
	    // for each key in "linesForSquare[index]", checks coordinates
	    //  stored in "lines" object to see if the game is won
	    if (winCheck(lines[linesForSquare[gamestate.move][i]], gamestate.cells)) {
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

	var listGames = function listGames() {
	  $.ajax({
	    url: myApp.baseUrl + '/games',
	    type: 'GET',
	    headers: {
	      Authorization: 'Token token=' + myApp.user.token
	    }
	  }).done(function (data) {
	    console.log(data);
	    var htmlInsert = '';
	    for (var i = 0; i < data.games.length; i++) {
	      htmlInsert += '<li id="" class="one-game">Game ID: ' + data.games[i].id + ',\n                    winner: ' + returnWinner(data.games[i].cells, data.games[i].over) + ',\n                    <br>player x: ' + data.games[i].player_x.email + '<br>\n                    player o: ' + (data.games[i].player_o ? data.games[i].player_o.email : 'none') + '</li>';
	    }

	    $('.games-list').html(htmlInsert);
	  }).fail(function (data) {
	    console.error(data);
	  });
	};

	// On page load, sets up the board and sets event listeners
	$(document).ready(function () {
<<<<<<< HEAD
	  newGame(gamestate);
	  $('.bigDiv').hide();
	  $('#win-message').hide();
=======
	  newGame(gameState, board);
	  $('.modalBox').hide();
>>>>>>> master

	  // IMPORTANT
	  // Recieves click input from user on board
	  $('.game-box').children().on('click', function () {
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

	    if (apiState.signedIn) {
	      updateFromGameToApi(gamestate);
	    }
	  });

	  // When the new-game button is clicked, the player is toggled before the
	  // newGame function is called. This is so, if the button is pressed before
	  // the game ends and the game counter is incremented, the same player
	  // who started the current game will start the next one
	  $('#new-game').on('click', function () {
	    if (!apiState.modalOpen) {
	      gamestate.changePlayer();
	      newGame(gamestate, board);
	    }
	  });

	  $('#sign-up-button').on('click', function () {
	    if (!apiState.modalOpen) {
	      $('.sign-up.modalBox').show();
	      apiState.modalOpen = true;
	    }
	  });

	  $('#sign-in-button').on('click', function () {
	    if (!apiState.modalOpen) {
	      $('.sign-in.modalBox').show();
	      apiState.modalOpen = true;
	    }
	  });

	  $('#change-password-button').on('click', function () {
	    // for some reason this if statement doesn't work if I include the commented code
	    if (!apiState.modalOpen /* && !apiState.signedIn*/) {
	        $('.change-password.modalBox').show();
	        apiState.modalOpen = true;
	      }
	  });

	  $('#my-games-button').on('click', function () {
	    if (!apiState.modalOpen && apiState.signedIn) {
	      $('.games-label').html(myApp.user.email + "'s Games");
	      listGames();
	      $('.my-games.modalBox').show();
	      apiState.modalOpen = true;
	    }
	  });

	  $(document).keyup(function (e) {
	    if (e.keyCode === 27) {
	      $('.modalBox').hide();
	      apiState.modalOpen = false;
	    }
	  });

	  $('#sign-up').on('submit', function (e) {

	    e.preventDefault();

	    var formData = new FormData(e.target);

	    $.ajax({

	      url: myApp.baseUrl + '/sign-up',
	      // url: 'http://httpbin.org/post',
	      method: 'POST',
	      contentType: false,
	      processData: false,
	      data: formData

	    }).done(function (data) {
	      console.log(data);
	      $('.form-field').val('');
	      $('.modalBox').hide();
	      apiState.modalOpen = false;
	    }).fail(function (jqxhr) {
	      console.error(jqxhr);
	      $('.form-field').val('');
	    });
	  });

	  $('#sign-in').on('submit', function (e) {

	    e.preventDefault();

	    var formData = new FormData(e.target);

	    $.ajax({

	      url: myApp.baseUrl + '/sign-in',
	      method: 'POST',
	      contentType: false,
	      processData: false,
	      data: formData

	    }).done(function (data) {
	      myApp.user = data.user;
	      console.log(data);
	      $('.form-field').val('');
	      $('.modalBox').hide();
	      apiState.signedIn = true;
	      apiState.modalOpen = false;
	      newGame(gamestate, board);
	      $('.user-name').html("Signed in as " + myApp.user.email);
	    }).fail(function (jqxhr) {
	      console.error(jqxhr);
	      $('.form-field').val('');
	    });
	  });

	  $('#change-password').on('submit', function (e) {
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
	        Authorization: 'Token token=' + myApp.user.token
	      },
	      contentType: false,
	      processData: false,
	      data: formData
	    }).done(function (data) {
	      console.log(data);
	      $('.form-field').val('');
	      $('.modalBox').hide();
	      apiState.modalOpen = false;
	    }).fail(function (jqxhr) {
	      console.error(jqxhr);
	      $('.form-field').val('');
	    });
	  });

	  $('#sign-out-button').on('click', function () {
	    if (!myApp.user) {
	      console.error('Wrong!');
	      return;
	    }

	    $.ajax({
	      url: myApp.baseUrl + '/sign-out/' + myApp.user.id,
	      method: 'DELETE',
	      headers: {
	        Authorization: 'Token token=' + myApp.user.token
	      }
	    }).done(function (data) {
	      console.log(data);
	      apiState.signedIn = false;
	      newGame(gamestate, board);
	      $('.user-name').html("");
	    }).fail(function (data) {
	      console.error(data);
	    });
	  });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(6);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(8)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./index.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./index.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	// imports


	// module
<<<<<<< HEAD
	exports.push([module.id, "body {\n  background-color: #fff;\n  color: #555;\n  margin-top: 20px;\n  font-size: 12px;\n  font-family: 'Cinzel', serif; }\n\nh1 {\n  text-align: center;\n  font-size: 36px; }\n\ndiv {\n  margin: 0 auto; }\n\n.bar div {\n  margin: 15px auto;\n  padding: 10px;\n  text-align: center; }\n\n.bar ul {\n  padding: 2px;\n  position: static;\n  margin: auto; }\n\n.bar li {\n  display: inline;\n  padding: 3px; }\n\n.game-button div {\n  display: inline;\n  padding: 2px;\n  background-color: #ff8383;\n  color: #000;\n  border-color: #000;\n  border-style: solid;\n  border-width: 2px;\n  border-radius: 3px;\n  transition: background-color .75s; }\n\n.game-button div:hover {\n  background-color: #cc6969;\n  cursor: pointer; }\n\n.scoreboard div {\n  display: inline;\n  width: auto;\n  padding: 2px 25px 2px 2px;\n  background-color: #fff;\n  color: #000;\n  border-color: #000;\n  border-style: solid;\n  border-width: 2px;\n  border-radius: 3px; }\n\n.scoreboard .score {\n  display: inline;\n  padding: 0 0 0 10px;\n  background-color: #fff;\n  border-color: #fff;\n  border-style: solid;\n  border-width: 0;\n  border-radius: 0; }\n\n.bottom-bar {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  background-color: #edd;\n  height: 90px;\n  font-size: 12px;\n  font-weight: bold;\n  text-align: center;\n  border-top-style: solid;\n  border-top-color: #555; }\n  .bottom-bar div {\n    margin: 15px auto;\n    padding: 5px 20px;\n    text-align: center;\n    transition: background-color .75s; }\n  .bottom-bar div:hover {\n    background-color: #cc6969;\n    cursor: pointer; }\n  .bottom-bar ul {\n    padding: 2px;\n    margin-top: 15px; }\n  .bottom-bar li {\n    display: inline;\n    padding: 3px; }\n  .bottom-bar .api-button {\n    display: inline;\n    padding: 2px;\n    background-color: #ff8383;\n    color: #000;\n    border-color: #000;\n    border-style: solid;\n    border-width: 2px;\n    border-radius: 3px; }\n\n.game-box {\n  margin: 0 auto;\n  background-color: #fff;\n  height: 300px;\n  width: 300px; }\n\n.square {\n  -moz-box-sizing: border-box;\n  -webkit-box-sizing: border-box;\n  background-color: #fff;\n  border-width: 2px;\n  box-sizing: border-box;\n  float: left;\n  font-size: 48px;\n  height: 33.33333%;\n  text-align: center;\n  padding-top: 18px;\n  width: 33.33333%;\n  transition: background-color .25s; }\n\n.square:hover {\n  background-color: #e6e6e6; }\n\n.top {\n  border-bottom: #555;\n  border-bottom-style: solid; }\n  .top .left {\n    clear: both;\n    border-top-left-radius: 20px; }\n\n.left {\n  border-right: #555;\n  border-right-style: solid; }\n\n.right {\n  border-left: #555;\n  border-left-style: solid; }\n\n.h-mid {\n  border-left: #555;\n  border-left-style: solid;\n  border-right: #555;\n  border-right-style: solid; }\n\n.v-mid {\n  border-bottom: #555;\n  border-bottom-style: solid;\n  border-top: #555;\n  border-top-style: solid; }\n\n.bottom {\n  border-top: #555;\n  border-top-style: solid; }\n\n.bigDiv {\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  margin-top: -75px;\n  height: 150px;\n  margin-left: -137px;\n  background-color: #edd;\n  width: 274px;\n  text-align: left;\n  padding-left: 20px;\n  border-style: solid;\n  border-color: #555; }\n  .bigDiv form input {\n    padding: 3px;\n    margin: 5px; }\n\n.sign-up {\n  margin-top: -90px;\n  height: 180px; }\n\n#win-message {\n  font-size: 60px;\n  font-weight: bold;\n  padding: 20px 0;\n  text-align: center;\n  height: auto; }\n\n.user-name {\n  font-family: \"Inconsolata\";\n  font-size: 9.6px;\n  color: #f33;\n  position: absolute;\n  left: 5px;\n  bottom: 95px; }\n\n.my-games {\n  width: 300px;\n  height: 320px;\n  margin-top: -160px;\n  margin-left: -150px;\n  overflow-x: hidden;\n  overflow-y: scroll;\n  font-size: 8.4px; }\n  .my-games h3 {\n    position: relative;\n    top: 5px;\n    left: 5px;\n    color: #000;\n    font-size: 12px; }\n\n@media (max-height: 600px) {\n  .game-box {\n    height: 300px;\n    width: 300px; } }\n\n@media (min-width: 320px) {\n  font-size: 6px; }\n\n@media (min-width: 500px) {\n  body {\n    margin-top: 45px; }\n  .game-box {\n    height: 425px;\n    width: 425px; }\n  .game-button {\n    height: 38px;\n    width: 405px; } }\n\n@media (min-width: 800px) {\n  body {\n    margin-top: 45px; }\n  .game-box {\n    height: 500px;\n    width: 500px; }\n  .game-button {\n    height: 52px;\n    width: 490px; } }\n", ""]);
=======
	exports.push([module.id, "body {\n  background-color: #fff;\n  color: #555;\n  margin-top: 20px;\n  font-size: 12px;\n  font-family: 'Cinzel', serif; }\n\nh1 {\n  text-align: center;\n  font-size: 36px; }\n\ndiv {\n  margin: 0 auto; }\n\n.bar div {\n  margin: 15px auto;\n  padding: 10px;\n  text-align: center; }\n\n.bar ul {\n  padding: 2px;\n  position: static;\n  margin: auto; }\n\n.bar li {\n  display: inline;\n  padding: 3px; }\n\n.game-button div {\n  display: inline;\n  padding: 2px;\n  background-color: #ff8383;\n  color: #000;\n  border-color: #000;\n  border-style: solid;\n  border-width: 2px;\n  border-radius: 3px;\n  transition: background-color .75s; }\n\n.game-button div:hover {\n  background-color: #cc6969;\n  cursor: pointer; }\n\n.scoreboard div {\n  display: inline;\n  width: auto;\n  padding: 2px 25px 2px 2px;\n  background-color: #fff;\n  color: #000;\n  border-color: #000;\n  border-style: solid;\n  border-width: 2px;\n  border-radius: 3px; }\n\n.scoreboard .score {\n  display: inline;\n  padding: 0 0 0 10px;\n  background-color: #fff;\n  border-color: #fff;\n  border-style: solid;\n  border-width: 0;\n  border-radius: 0; }\n\n.bottom-bar {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  background-color: #edd;\n  height: 90px;\n  font-size: 12px;\n  font-weight: bold;\n  text-align: center;\n  border-top-style: solid;\n  border-top-color: #555; }\n  .bottom-bar div {\n    margin: 15px auto;\n    padding: 5px 20px;\n    text-align: center;\n    transition: background-color .75s; }\n  .bottom-bar div:hover {\n    background-color: #cc6969;\n    cursor: pointer; }\n  .bottom-bar ul {\n    padding: 2px;\n    margin-top: 15px; }\n  .bottom-bar li {\n    display: inline;\n    padding: 3px; }\n  .bottom-bar .api-button {\n    display: inline;\n    padding: 2px;\n    background-color: #ff8383;\n    color: #000;\n    border-color: #000;\n    border-style: solid;\n    border-width: 2px;\n    border-radius: 3px; }\n  .bottom-bar .my-games {\n    overflow-y: scroll; }\n\n.game-box {\n  margin: 0 auto;\n  background-color: #fff;\n  height: 300px;\n  width: 300px; }\n\n.square {\n  -moz-box-sizing: border-box;\n  -webkit-box-sizing: border-box;\n  background-color: #fff;\n  border-width: 2px;\n  box-sizing: border-box;\n  float: left;\n  font-size: 48px;\n  height: 33.33333%;\n  text-align: center;\n  padding-top: 18px;\n  width: 33.33333%;\n  transition: background-color .25s; }\n\n.square:hover {\n  background-color: #e6e6e6; }\n\n.top {\n  border-bottom: #555;\n  border-bottom-style: solid; }\n  .top .left {\n    clear: both;\n    border-top-left-radius: 20px; }\n\n.left {\n  border-right: #555;\n  border-right-style: solid; }\n\n.right {\n  border-left: #555;\n  border-left-style: solid; }\n\n.h-mid {\n  border-left: #555;\n  border-left-style: solid;\n  border-right: #555;\n  border-right-style: solid; }\n\n.v-mid {\n  border-bottom: #555;\n  border-bottom-style: solid;\n  border-top: #555;\n  border-top-style: solid; }\n\n.bottom {\n  border-top: #555;\n  border-top-style: solid; }\n\n.modalBox {\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  margin-top: -75px;\n  height: 150px;\n  margin-left: -137px;\n  background-color: #edd;\n  width: 274px;\n  text-align: left;\n  padding-left: 20px;\n  border-style: solid;\n  border-color: #555; }\n  .modalBox form input {\n    padding: 3px;\n    margin: 5px; }\n\n.sign-up {\n  margin-top: -90px;\n  height: 180px; }\n\n.user-name {\n  font-family: \"Inconsolata\";\n  font-size: 9.6px;\n  color: #f33;\n  position: absolute;\n  left: 5px;\n  bottom: 95px; }\n\n.my-games {\n  width: 300px;\n  height: 320px;\n  margin-top: -160px;\n  margin-left: -150px;\n  overflow-x: hidden;\n  overflow-y: scroll;\n  font-size: 8.4px; }\n  .my-games h3 {\n    position: relative;\n    top: 5px;\n    left: 5px;\n    color: #000;\n    font-size: 12px; }\n\n@media (max-height: 600px) {\n  .game-box {\n    height: 300px;\n    width: 300px; } }\n\n@media (min-width: 320px) {\n  font-size: 6px; }\n\n@media (min-width: 500px) {\n  body {\n    margin-top: 45px; }\n  .game-box {\n    height: 425px;\n    width: 425px; }\n  .game-button {\n    height: 38px;\n    width: 405px; } }\n\n@media (min-width: 800px) {\n  body {\n    margin-top: 45px; }\n  .game-box {\n    height: 500px;\n    width: 500px; }\n  .game-button {\n    height: 52px;\n    width: 490px; } }\n", ""]);
>>>>>>> master

	// exports


/***/ },
/* 7 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["$"] = __webpack_require__(4);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["jQuery"] = __webpack_require__(4);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }
]);