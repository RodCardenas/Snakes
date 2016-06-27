var Snake = require("./snake");

Function.prototype.inherits = function (BaseClass) {
  function Surrogate () {}
  Surrogate.prototype = BaseClass.prototype;
  this.prototype = new Surrogate();
  this.prototype.constructor = this;
};

var SmartSnake = function (pos){
  Snake.call(this, pos);
  this.path = [];
  this.pathApple = [];
};

SmartSnake.inherits(Snake);

SmartSnake.prototype.move = function (apple, board) {
  var head = this.segments[0];
  var segment = [];

  console.log("head is at " + head);

  if (this.pathApple[0] !== apple[0] || this.pathApple[1] !== apple[1]) {
    console.log("New Apple");
    this.pathApple = apple;
    this.defineNewPath(head, apple);
  } else {
    if (this.path.length === 0 ) {
      this.defineNewPath(head, apple);
    }
  }

  this.direction = this.path.pop(1);

  // debugger;

  switch (this.direction)
  {
    case "up":
      segment = [head[0],head[1] - 1];
      break;
    case "down":
      segment = [head[0],head[1] + 1];
      break;
    case "right":
      segment = [head[0] + 1, head[1]];
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

SmartSnake.prototype.manhattanDistance = function (head, apple) {
    var dx = Math.abs( head[0] - apple[0] );
    var dy = Math.abs( head[1] - apple[1] );
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

SmartSnake.prototype.defineNewPath = function (head, apple) {
  this.path = [];
  var dx = head[0] - apple[0];
  var dy = head[1] - apple[1];
  var distance = Math.abs(dx) + Math.abs(dy);

  while (this.path.length < distance){
    if (dx > 0) {
      this.path.push("left");
      dx--;
    } else if (dy > 0) {
      this.path.push("up");
      dy--;
    } else if (dy < 0) {
      this.path.push("down");
      dy++;
    } else if (dx < 0) {
      this.path.push("right");
      dx++;
    }
  }
};

module.exports = SmartSnake;
