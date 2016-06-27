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

	var Board = __webpack_require__(2);
	
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
	    if(e.message.includes("Red")){
	      $("#loser").attr("src", "http://giphy.com/embed/SKkHndWFqOjjG?html5=true");
	      $(".modal-content").css("background-color", "rgb(0,150,255)");
	    } else {
	      $("#loser").attr("src", "http://giphy.com/embed/3VQDfP4q4ZYyY?html5=true");
	      $(".modal-content").css("background-color", "rgb(255,40,0)");
	    }
	
	    $("#reason").text(e.message);
	    $("#gameover").css({display: "block"});
	    $("#players-label").show();
	    $("#color-label").show();
	    $(".start-game").css("display", "block");
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
	  view.addModalInteraction();
	
	  $(".snake").focus();
	  $(window).on("keydown", function(e){
	    view.handleKeyPress(e.keyCode);
	  });
	};
	
	View.prototype.addStartGame = function () {
	  var view = this;
	
	  $(".snake").on("click", function(e){
	    e.preventDefault();
	    if(view.loop === null){
	      $(".start-game").css("display", "none");
	      $("#players-label").hide("slow");
	      $("#color-label").hide("slow");
	      view.board.reset();
	      view.loop = setInterval(view.step.bind(view), 250);
	    }
	  });
	
	  $(".start-game").on("click", function(e){
	    e.preventDefault();
	    if(view.loop === null){
	      $(".start-game").css("display", "none");
	      $("#players-label").hide("slow");
	      $("#color-label").hide("slow");
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
	      $(".pokesong").attr("src","./img/play.png");
	    }
	    else
	    {
	      audio.play();
	      $(".pokesong").attr("src","./img/mute.png");
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
	      view.board.ai = false;
	    } else {
	      view.addSnakeColorOption();
	      view.board.ai = true;
	    }
	  });
	};
	
	View.prototype.removeSnakeColorOption = function() {
	  $("#color").remove();
	  $("#color-label").remove();
	  $("#selector-spacer").remove();
	  this.board.removeSmartSnake();
	};
	
	View.prototype.addSnakeColorOption = function() {
	  var container = $(".selectors-container");
	  var view = this;
	
	  $('<div />', { id:"selector-spacer", class:"spacer"}).appendTo(container);
	  $('<input />', { type: 'checkbox', id: "color", class:"tgl tgl-flip"}).appendTo(container);
	  $('<label />', { 'for': 'color', id: "color-label", tagOff:"웃", tagOn:"웃", class:"tgl-btn"}).appendTo(container);
	
	  if($("#blue-instructions").length){
	    view.removePlayerInstructions("blue");
	  }
	
	  if ($("#red-instructions").length) {
	    view.removePlayerInstructions("red");
	  }
	  $("#instructions-spacer").remove();
	
	  view.addPlayerInstructions("red");
	  view.board.setSmartSnake("Blue");
	
	  $("#color-label").on("click", function(e){
	    if($("#color").prop('checked')){
	      view.addPlayerInstructions("red");
	      view.removePlayerInstructions("blue");
	      view.board.setSmartSnake("Blue");
	    } else {
	      view.addPlayerInstructions("blue");
	      view.removePlayerInstructions("red");
	      view.board.setSmartSnake("Red");
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
	
	View.prototype.addModalInteraction = function(){
	  var modal = $("#gameover");
	
	  $(".close").on("click", function() {
	    modal.css({display: "none"});
	  });
	
	  window.onclick = function(event) {
	    if (event.target.id === "gameover" ) {
	      modal.css({display: "none"});
	    }
	  };
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
/***/ function(module, exports, __webpack_require__) {

	var Snake = __webpack_require__(3);
	var SmartSnake = __webpack_require__(5);
	
	// Snake 1 == Red
	// Snake 2 == Blue
	
	var Board = function(size){
	  this.size = size;
	  this.snake1 = new Snake([Math.floor(size[0]/2) - 1, Math.floor(size[1]/2)]);
	  this.snake2 = new Snake([Math.floor(size[0]/2), Math.floor(size[1]/2)]);
	  this.apple = [Math.floor(Math.random() * size[0]),
	    Math.floor(Math.random() * size[1])];
	  this.ai = false;
	};
	
	Board.prototype.setSmartSnake = function (color) {
	  var size = this.size;
	
	  if (color === "Red") {
	    this.snake1 = new SmartSnake([Math.floor(size[0]/2) - 1, Math.floor(size[1]/2)]);
	    this.snake2 = new Snake([Math.floor(size[0]/2), Math.floor(size[1]/2)]);
	  } else {
	    this.snake1 = new Snake([Math.floor(size[0]/2) - 1, Math.floor(size[1]/2)]);
	    this.snake2 = new SmartSnake([Math.floor(size[0]/2), Math.floor(size[1]/2)]);
	  }
	};
	
	Board.prototype.removeSmartSnake = function () {
	  var size = this.size;
	
	  this.snake1 = new Snake([Math.floor(size[0]/2) - 1, Math.floor(size[1]/2)]);
	  this.snake2 = new Snake([Math.floor(size[0]/2), Math.floor(size[1]/2)]);
	};
	
	Board.prototype.move = function (direction) {
	  var snake1Dirs = ["N","E","W","S"];
	  var snake2Dirs = ["up","right","left","down"];
	
	  if(snake1Dirs.indexOf(direction) !== -1 && !(this.snake1 instanceof SmartSnake)){
	    this.snake1.turn(direction);
	  }else if (snake2Dirs.indexOf(direction) !== -1 && !(this.snake2 instanceof SmartSnake)) {
	    this.snake2.turn(direction);
	  }
	};
	
	Board.prototype.render = function () {
	  this.snake1.move(this);
	  this.snake2.move(this);
	
	  try {
	    this.snake1.harakiri();
	  }catch(e){
	    throw new Error("Red Snake went over itself!");
	  }
	
	  try {
	    this.snake2.harakiri();
	  }catch(e){
	    throw new Error("Blue Snake went over itself!");
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
	    throw new Error("Red Snake ran into the other Snake!");
	  }
	
	  try {
	    this.snakeCrossing(this.snake2, this.snake1);
	  }catch(e){
	    throw new Error("Blue Snake ran into the other Snake!");
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
	  var size = this.size;
	
	  if (this.snake1 instanceof SmartSnake) {
	    this.snake1 = new SmartSnake([Math.floor(size[0]/2) - 1, Math.floor(size[1]/2)]);
	  } else {
	    this.snake1 = new Snake([Math.floor(this.size[0]/2) - 1,
	      Math.floor(this.size[1]/2)]);
	  }
	
	  if (this.snake2 instanceof SmartSnake) {
	    this.snake2 = new SmartSnake([Math.floor(size[0]/2), Math.floor(size[1]/2)]);
	  } else {
	    this.snake2 = new Snake([Math.floor(this.size[0]/2),
	      Math.floor(this.size[1]/2)]);
	  }
	
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
	
	Board.prototype.getOpenSpace = function() {
	  var space = [Math.floor(Math.random() * this.size[0]),
	    Math.floor(Math.random() * this.size[1])];
	
	  while(this.snake1.segments.includes(space) || this.snake2.segments.includes(space)){
	    space = [Math.floor(Math.random() * this.size[0]),
	      Math.floor(Math.random() * this.size[1])];
	  }
	
	  return space;
	};
	
	Board.prototype.regenerateApple = function () {
	  this.apple = this.getOpenSpace();
	};
	
	module.exports = Board;


/***/ },
/* 3 */
/***/ function(module, exports) {

	var Snake = function(pos){
	  this.direction = "N";
	  this.segments = [pos];
	  this.turnsToGrow = 0;
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
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Snake = __webpack_require__(3);
	
	Function.prototype.inherits = function (BaseClass) {
	  function Surrogate () {}
	  Surrogate.prototype = BaseClass.prototype;
	  this.prototype = new Surrogate();
	  this.prototype.constructor = this;
	};
	
	var SmartSnake = function (pos){
	  Snake.call(this, pos);
	  this.direction = "u";
	  this.path = [];
	  this.pathApple = [];
	  this.locations = [];
	};
	
	SmartSnake.inherits(Snake);
	
	SmartSnake.prototype.move = function (board) {
	  var head = this.segments[0];
	  var segment = [];
	
	  if (this.pathApple[0] !== board.apple[0] || this.pathApple[1] !== board.apple[1]) {
	    this.pathApple = board.apple;
	    this.defineNewPath(head, board);
	  } else {
	    if (this.path.length <= 1 ) { // || this.pathInterrupted(board))
	      this.defineNewPath(head, board);
	    }
	  }
	
	
	  this.direction = this.path.pop(1);
	  console.log("path = " + this.path);
	  console.log("dir = " + this.direction);
	
	  switch (this.direction)
	  {
	    case "u":
	      segment = [head[0],head[1] - 1];
	      break;
	    case "d":
	      segment = [head[0],head[1] + 1];
	      break;
	    case "r":
	      segment = [head[0] + 1, head[1]];
	      break;
	    case "l":
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
	
	SmartSnake.prototype.manhattanDistance = function (head, board) {
	    var dx = Math.abs( head[0] - board.apple[0] );
	    var dy = Math.abs( head[1] - board.apple[1] );
	    return dx + dy;
	};
	
	SmartSnake.prototype.pathInterrupted = function (board) {
	  console.log("Checking Interruptions");
	  var otherSnake;
	  if (this !== board.snake1) {
	    otherSnake = board.snake1;
	  } else {
	    otherSnake = board.snake2;
	  }
	
	  otherSnake.segments.forEach(function(elSnake, sdx){
	    this.path.forEach(function(elPath, pdx) {
	      if(elSnake[0] === elPath[0] && elSnake[1] === elPath[1]){
	        return true;
	      }
	    });
	  });
	
	  return false;
	};
	
	SmartSnake.prototype.defineNewPath = function (head, board) {
	  this.path = [];
	  this.locations = [];
	
	  var dx = board.apple[0] - head[0];
	  var dy = board.apple[1] - head[1];
	  var distance = Math.abs(dx) + Math.abs(dy);
	  var greaterThan = true;
	  var lessThan = false;
	
	  switch (this.direction)
	  {
	    case "u":
	      dx = this.chooseFirstStep(dy, greaterThan, dx, "l", "r");
	      break;
	    case "d":
	      dx = this.chooseFirstStep(dy, lessThan, dx, "l", "r");
	      break;
	    case "r":
	      dy = this.chooseFirstStep(dx, lessThan, dy, "u", "d");
	      break;
	    case "l":
	      dy = this.chooseFirstStep(dx, greaterThan, dy, "u", "d");
	      break;
	  }
	
	  while (this.path.length < distance){
	    // var position = this.path[this.path.length - 1];
	    if (dx < 0) {
	      this.path.push("l");
	      // this.locations.push([position[0] - 1,position[1]]);
	      dx++;
	    } else if (dy < 0) {
	      this.path.push("u");
	      // this.locations.push([position[0],position[1] + 1]);
	      dy++;
	    } else if (dy > 0) {
	      this.path.push("d");
	      // this.locations.push([position[0],position[1] - 1]);
	      dy--;
	    } else if (dx > 0) {
	      this.path.push("r");
	      // this.locations.push([position[0] + 1,position[1]]);
	      dx--;
	    }
	  }
	
	  this.path.push(this.path.shift(1));
	};
	
	SmartSnake.prototype.chooseFirstStep = function(check1st, comparator, check2nd, direction, opposite) {
	  if (comparator ? (check1st > 0) : (check1st < 0)) {
	    if (check2nd < 0) {
	      this.path.push(direction);
	      check2nd++;
	    } else {
	      this.path.push(opposite);
	      check2nd--;
	    }
	  }
	  return check2nd;
	};
	
	SmartSnake.prototype.opposites = function (dir1, dir2) {
	  // console.log("1 = " + dir1);
	  // console.log("2 = " + dir2);
	  if (dir1 === "u" && dir2 === "d" || dir2 === "u" && dir1 === "d") {
	    return true;
	  } else if (dir1 === "r" && dir2 === "l" || dir2 === "r" && dir1 === "l") {
	    return true;
	  }
	  return false;
	};
	
	module.exports = SmartSnake;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map