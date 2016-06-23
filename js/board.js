var Snake = require("./snake");

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