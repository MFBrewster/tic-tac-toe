'use strict';

// user require with a reference to bundle the file and use it in this file
// var example = require('./example');

// use require without a reference to ensure a file is bundled
require('./example');

// Requiring javascript file with game logic
require('./game-logic');

// load sass manifest
require('../styles/index.scss');

$(document).ready(() => {
  console.log('It works.');
});
