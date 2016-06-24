/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var View = __webpack_require__(1);
	
	
	$(function () {
	  var snakeGame = new View($(".snake"));
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Board = __webpack_require__(3);
	
	var View = function($el){
	  this.SIZE = [20,20];
	  this.domObj = $el;
	  this.board = new Board(this.SIZE);
	  this.loop = null;
	  this.setupDOMObj();
	  this.bindEvents();
	};
	
	View.prototype.setupDOMObj = function () {
	  for (var i = 0; i < this.SIZE[0]; i++) {
	    this.domObj.append("<ul class='row' data-row='"+i+"'></ul>");
	    for (var j = 0; j < this.SIZE[1]; j++) {
	      $("ul[data-row="+i+"]")
	        .append("<li class='col' data-pos='"+[i,j]+"'></li>");
	    }
	  }
	};
	
	View.prototype.step = function () {
	  try{
	    var boardInfo = this.board.render();
	
	  }catch(e){
	    clearInterval(this.loop);
	    alert(e.message);
	    this.loop = null;
	    return;
	  }
	
	  var snake1 = boardInfo.snakeone;
	  var snake2 = boardInfo.snaketwo;
	  var apple = boardInfo.apple;
	  $(".segment1").removeClass("segment1");
	  $(".segment2").removeClass("segment2");
	  $(".apple").text("");
	  $(".apple").removeClass("apple");
	
	  snake1.forEach(function(pos){
	    $("li[data-pos='"+pos[1]+","+pos[0]+"']").addClass("segment1");
	  });
	
	  snake2.forEach(function(pos){
	    $("li[data-pos='"+pos[1]+","+pos[0]+"']").addClass("segment2");
	  });
	
	  $("li[data-pos='"+apple[1]+","+apple[0]+"']").addClass("apple");
	  $(".apple").text("\uD83C\uDF6C");
	};
	
	View.prototype.bindEvents = function () {
	  var view = this;
	
	  view.addStartGame();
	  view.addMusic();
	  view.addPlayersSelection();
	
	  $(".snake").focus();
	  $(window).on("keydown", function(e){
	    view.handleKeyPress(e.keyCode);
	  });
	};
	
	View.prototype.addStartGame = function () {
	  var view = this;
	  $(".start-game").on("click", function(e){
	    e.preventDefault();
	    if(view.loop === null){
	      view.board.reset();
	      view.loop = setInterval(view.step.bind(view), 250);
	    }
	  });
	};
	
	View.prototype.addMusic = function () {
	  var audio = document.getElementById("pokesong");
	  var playpause = false;
	
	  $(".pokesong").on("click", function(e){
	    e.preventDefault();
	    playpause = !playpause;
	
	    if(playpause)
	    {
	      audio.pause();
	      $(".pokesong").text("►");
	    }
	    else
	    {
	      audio.play();
	      $(".pokesong").text("❚❚");
	    }
	  });
	};
	
	View.prototype.addPlayersSelection = function () {
	  var view = this;
	
	  $("#players-label").on("click", function(e){
	    if($("#players").prop('checked')){
	      if($("#color").length){
	        view.removeSnakeColorOption();
	      }
	      view.removePlayerInstructions("red");
	      view.removePlayerInstructions("blue");
	      view.addPlayerInstructions("red");
	      $('<div />', { id:"instructions-spacer", class:"spacer"}).appendTo($(".instructions-container"));
	      view.addPlayerInstructions("blue");
	    } else {
	      view.addSnakeColorOption();
	    }
	  });
	};
	
	
	View.prototype.removeSnakeColorOption = function() {
	  $("#color").remove();
	  $("#color-label").remove();
	  $("#selector-spacer").remove();
	};
	
	View.prototype.addSnakeColorOption = function() {
	  var container = $(".selectors-container");
	  var view = this;
	
	  //add elements
	  $('<div />', { id:"selector-spacer", class:"spacer"}).appendTo(container);
	  $('<input />', { type: 'checkbox', id: "color", class:"tgl tgl-flip"}).appendTo(container);
	  $('<label />', { 'for': 'color', id: "color-label", tagOff:"웃", tagOn:"웃", class:"tgl-btn"}).appendTo(container);
	
	  //remove old instructions
	  if($("#blue-instructions").length){
	    view.removePlayerInstructions("blue");
	  }
	
	  if ($("#red-instructions").length) {
	    view.removePlayerInstructions("red");
	  }
	  $("#instructions-spacer").remove();
	
	  view.addPlayerInstructions("red");
	  //add event listener
	  $("#color-label").on("click", function(e){
	    if($("#color").prop('checked')){
	      view.addPlayerInstructions("red");
	      view.removePlayerInstructions("blue");
	    } else {
	      view.addPlayerInstructions("blue");
	      view.removePlayerInstructions("red");
	    }
	  });
	};
	
	View.prototype.addPlayerInstructions = function (color) {
	  var instructions = color + "-instructions";
	
	  $('<div />', { id:instructions, class:"instructions"}).appendTo($(".instructions-container"));
	
	  var instructionsEl = $("#" + color + "-instructions");
	
	  if (color === "red") {
	    instructionsEl.append($('<img />', { src:"./img/LUDR.png"}));
	    instructionsEl.append($('<br />'));
	    $('<em />', {class:"fire", text:"Red Snake"}).appendTo(instructionsEl);
	  } else {
	    instructionsEl.append($('<img />', { src:"./img/WASD.png"}));
	    instructionsEl.append($('<br />'));
	    $('<em />', {class:"water", text:"Blue Snake"}).appendTo(instructionsEl);
	  }
	};
	View.prototype.removePlayerInstructions = function (color) {
	  $("#" + color + "-instructions").remove();
	};
	
	View.prototype.handleKeyPress = function (keyCode) {
	  var direction = "";
	  switch (keyCode)
	  {
	    case 38:
	      direction = "N";
	      break;
	    case 40:
	      direction = "S";
	      break;
	    case 39:
	      direction = "E";
	      break;
	    case 37:
	      direction = "W";
	      break;
	
	    case 87:
	      direction = "up";
	      break;
	    case 65:
	      direction = "left";
	      break;
	    case 83:
	      direction = "down";
	      break;
	    case 68:
	      direction = "right";
	      break;
	  }
	
	  this.board.move(direction);
	};
	
	module.exports = View;


/***/ },
/* 2 */
/***/ function(module, exports) {

	var Snake = function(pos, color){
	  this.direction = "N";
	  this.segments = [pos];
	  this.turnsToGrow = 0;
	  this.color = color;
	};
	
	Snake.prototype.move = function () {
	  var head = this.segments[0];
	  var segment = [];
	  switch (this.direction)
	  {
	    case "N":
	      segment = [head[0],head[1] - 1];
	      break;
	    case "up":
	      segment = [head[0],head[1] - 1];
	      break;
	    case "S":
	      segment = [head[0],head[1] + 1];
	      break;
	    case "down":
	      segment = [head[0],head[1] + 1];
	      break;
	    case "E":
	      segment = [head[0] + 1, head[1]];
	      break;
	    case "right":
	      segment = [head[0] + 1, head[1]];
	      break;
	    case "W":
	      segment = [head[0] - 1,head[1]];
	      break;
	    case "left":
	      segment = [head[0] - 1,head[1]];
	      break;
	  }
	
	  this.segments.unshift(segment);
	  if (this.turnsToGrow > 0){
	    this.turnsToGrow--;
	  }else{
	    this.segments.pop(1);
	  }
	};
	
	Snake.prototype.turn = function (direction) {
	  this.direction = direction;
	};
	
	Snake.prototype.harakiri = function () {
	  var head = this.segments[0];
	  this.segments.forEach(function(el, idx){
	    if(idx > 0){
	      if(head[0] === el[0] && head[1] === el[1]){
	        throw new Error("Snake dead!");
	      }
	    }
	  });
	  return false;
	};
	
	
	Snake.prototype.grow = function () {
	  this.turnsToGrow += 1;
	};
	
	
	module.exports = Snake;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Snake = __webpack_require__(2);
	
	var Board = function(size){
	  this.size = size;
	  this.snake1 = new Snake([Math.floor(size[0]/2), Math.floor(size[1]/2)], "Red");
	  this.snake2 = new Snake([Math.floor(size[0]/2) + 1, Math.floor(size[1]/2)], "Blue");
	  this.apple = [Math.floor(Math.random() * size[0]),
	    Math.floor(Math.random() * size[1])];
	};
	
	Board.prototype.move = function (direction) {
	  var snake1Dirs = ["N","E","W","S"];
	  var snake2Dirs = ["up","right","left","down"];
	  if(snake1Dirs.indexOf(direction) !== -1 ){
	    this.snake1.turn(direction);
	  }else if (snake2Dirs.indexOf(direction) !== -1) {
	    this.snake2.turn(direction);
	  }
	};
	
	Board.prototype.render = function () {
	  this.snake1.move();
	  this.snake2.move();
	
	  try {
	    this.snake1.harakiri();
	  }catch(e){
	    throw new Error("Red Snake went over itself and is dead!");
	  }
	
	  try {
	    this.snake2.harakiri();
	  }catch(e){
	    throw new Error("Blue Snake went over itself and is dead!");
	  }
	
	  try {
	  this.snakeOutOfBounds(this.snake1);
	  }catch(e){
	    throw new Error("Red Snake Out of Bounds!");
	  }
	
	  try {
	    this.snakeOutOfBounds(this.snake2);
	  }catch(e){
	    throw new Error("Blue Snake Out of Bounds!");
	  }
	
	  try {
	    this.snakeCrossing(this.snake1, this.snake2);
	  }catch(e){
	    throw new Error("Red Snake ran into Blue Snake!");
	  }
	
	  try {
	    this.snakeCrossing(this.snake2, this.snake1);
	  }catch(e){
	    throw new Error("Blue Snake ran into Red Snake!");
	  }
	
	  this.ateApple(this.snake1);
	  this.ateApple(this.snake2);
	
	  return this.draw();
	};
	
	Board.prototype.snakeCrossing = function (snake1, snake2) {
	  var head = snake1.segments[0];
	  snake2.segments.forEach(function(el, idx){
	    if(idx > 0){
	      if(head[0] === el[0] && head[1] === el[1]){
	        throw new Error("Snake dead!");
	      }
	    }
	  });
	};
	
	Board.prototype.ateApple = function (snake) {
	  if (snake.segments[0][0] === this.apple[0] &&
	        snake.segments[0][1] === this.apple[1]){
	    snake.grow();
	    this.regenerateApple();
	  }
	};
	
	Board.prototype.reset = function () {
	  this.snake1 = new Snake([Math.floor(this.size[0]/2),
	    Math.floor(this.size[1]/2)], "Red");
	  this.snake2 = new Snake([Math.floor(this.size[0]/2) + 1,
	    Math.floor(this.size[1]/2)], "Blue");
	  this.apple = [Math.floor(Math.random() * this.size[0]),
	    Math.floor(Math.random() * this.size[1])];
	};
	
	Board.prototype.snakeOutOfBounds = function (snake) {
	  if (snake.segments[0][0] > this.size[0] ||
	    snake.segments[0][0] < 0 ||
	    snake.segments[0][1] > this.size[1] ||
	    snake.segments[0][1] < 0){
	    throw new Error("Snake out of bounds!");
	  }
	};
	
	Board.prototype.draw = function () {
	  return {snakeone: this.snake1.segments,
	          snaketwo: this.snake2.segments,
	          apple: this.apple};
	};
	
	Board.prototype.regenerateApple = function () {
	  this.apple = [Math.floor(Math.random() * this.size[0]),
	    Math.floor(Math.random() * this.size[1])];
	};
	
	module.exports = Board;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map