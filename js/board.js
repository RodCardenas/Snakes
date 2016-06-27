var Snake = require("./snake");
var SmartSnake = require("./smartSnake");

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
